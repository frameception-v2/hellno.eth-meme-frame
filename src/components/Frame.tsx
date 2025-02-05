"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import sdk, {
  AddFrame,
  SignIn as SignInCore,
  type Context,
} from "@farcaster/frame-sdk";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { PROJECT_TITLE, PROJECT_DESCRIPTION, IMGFLIP_API_URL, DEFAULT_MEME_LIMIT, IMGFLIP_MEME_GENERATOR_URL } from "~/lib/constants";
import { Label } from "~/components/ui/label";

interface Meme {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
}

export default function Frame() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();
  const [added, setAdded] = useState(false);
  const [addFrameResult, setAddFrameResult] = useState("");
  const [memes, setMemes] = useState<Meme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleMemes, setVisibleMemes] = useState(DEFAULT_MEME_LIMIT);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchMemes = useCallback(async () => {
    try {
      const response = await fetch(IMGFLIP_API_URL);
      if (!response.ok) throw new Error('Failed to fetch memes');
      
      const data = await response.json();
      if (!data.success) throw new Error('Imgflip API error');
      
      setMemes(data.data.memes);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load memes');
      setMemes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && memes.length > visibleMemes) {
          setVisibleMemes(prev => prev + DEFAULT_MEME_LIMIT);
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [visibleMemes, memes.length]);

  const addFrame = useCallback(async () => {
    try {
      await sdk.actions.addFrame();
    } catch (error) {
      if (error instanceof AddFrame.RejectedByUser) {
        setAddFrameResult(`Not added: ${error.message}`);
      }
      if (error instanceof AddFrame.InvalidDomainManifest) {
        setAddFrameResult(`Not added: ${error.message}`);
      }
      setAddFrameResult(`Error: ${error}`);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      if (!context) return;

      setContext(context);
      setAdded(context.client.added);

      if (!context.client.added) {
        addFrame();
      }

      sdk.on("frameAdded", ({ notificationDetails }) => {
        setAdded(true);
      });

      sdk.on("frameAddRejected", ({ reason }) => {
        console.log("frameAddRejected", reason);
      });

      sdk.on("frameRemoved", () => {
        console.log("frameRemoved");
        setAdded(false);
      });

      sdk.actions.ready({});
      
      await fetchMemes();
    };
    
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded, addFrame, fetchMemes]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div className="w-full md:w-[300px] mx-auto py-2 px-4">
        {error && (
          <Card className="mb-4 bg-red-50">
            <CardContent className="pt-4">
              <Label className="text-red-600">{error}</Label>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="text-center">Loading memes...</div>
        ) : (
          memes.slice(0, visibleMemes).map((meme, index) => (
            <Card 
              key={meme.id} 
              className="mb-4 w-full"
              ref={index === visibleMemes - 1 ? loadMoreRef : null}
            >
              <CardHeader>
                <CardTitle className="text-sm">{meme.name}</CardTitle>
                <CardDescription className="text-xs">
                  Boxes: {meme.box_count}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src={meme.url}
                  alt={meme.name}
                  className="w-full h-auto rounded"
                  style={{
                    maxHeight: '300px',
                    objectFit: 'cover'
                  }}
                />
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => window.open(`${IMGFLIP_MEME_GENERATOR_URL}${meme.id}`, '_blank')}
                >
                  Open in Imgflip
                </Button>
              </CardContent>
            </Card>
          ))
        )}
        
        {visibleMemes < memes.length && (
          <div className="text-center py-4">
            <Button 
              variant="ghost"
              onClick={() => setVisibleMemes(prev => prev + DEFAULT_MEME_LIMIT)}
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
