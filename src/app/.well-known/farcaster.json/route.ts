import { PROJECT_TITLE } from "~/lib/constants";

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  const config = {
    accountAssociation: {
      header: "eyJtZXNzYWdlIjp7ImRvbWFpbiI6ImhlbGxub2V0aC1tZW1lLWZyYW1lLnZlcmNlbC5hcHAiLCJ0aW1lc3RhbXAiOjE3Mzg3ODQ3ODcsImV4cGlyYXRpb25UaW1lIjoxNzQ2NTYwNzg3fQ==",
      payload: "eyJzaWduYXR1cmUiOiI5NjY4MzE2Y2FhOTJkNDc0Yzk3ZThlZjE0NWZkMzRkY2U5NGVkYWQ0MzFkMzU5YTMwZWVmNTEzMGFmNDFjYWQxNzFhMDYzNTM5NjFlZDBhMDJkYzg0OTY4ZmUzYzU5YWE5NmFkYjg2ZGM1ZTZjM2UyMzhkYWVmZmExYmEzMWRkODFiIiwic2lnbmluZ0tleSI6IjVkMjI2ZDU0MGJiM2M5NDE1ODJlMDcwMWRmNmQyMWM0ZWVkMzY5MWFiMGQyZTU5MmUwYjFiNmY2NGM2YzBkMDUifQ==",
      signature: "MHhiNDIwMzQ1MGZkNzgzYTExZjRiOTllZTFlYjA3NmMwOTdjM2JkOTY1NGM2ODZjYjkyZTAyMzk2Y2Q0YjU2MWY1MjY5NjI5ZGQ5NTliYjU0YzEwOGI4OGVmNjdjMTVlZTdjZDc2YTRiMGU5NzkzNzA3YzkxYzFkOWFjNTg0YmQzNjFi"
    },
    frame: {
      version: "1",
      name: PROJECT_TITLE,
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/frames/hello/opengraph-image`,
      buttonTitle: "Launch Frame",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#f7f7f7",
      webhookUrl: `${appUrl}/api/webhook`,
    },
  };

  return Response.json(config);
}
