"use client";

import { useEffect, useCallback, useState } from "react";
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
import { PROJECT_TITLE, PROJECT_DESCRIPTION, IMGFLIP_API_URL, DEFAULT_MEME_LIMIT } from "~/lib/constants";
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

  const fetchMemes = useCallback(async () => {
    try {
      const response = await fetch(IMGFLIP_API_URL);
      if (!response.ok) throw new Error('Failed to fetch memes');
      
      const data = await response.json();
      if (!data.success) throw new Error('Imgflip API error');
      
      setMemes(data.data.memes.slice(0, DEFAULT_MEME_LIMIT));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load memes');
      setMemes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
      
      // Fetch memes after SDK setup
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
          memes.map((meme) => (
            <Card key={meme.id} className="mb-4 w-full">
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
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
