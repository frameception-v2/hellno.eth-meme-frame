import { PROJECT_TITLE } from "~/lib/constants";

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  const config = {
    accountAssociation: {
      compact: "eyJmaWQiOiA4Njk5OTksICJ0eXBlIjogImN1c3RvZHkiLCAia2V5IjogIjB4N0Q0MDBGRDFGNTkyYkI0RkNkNmEzNjNCZkQyMDBBNDNEMTY3MDRlNyJ9.eyJkb21haW4iOiAiaGVsbG5vZXRoLW1lbWUtZnJhbWUudmVyY2VsLmFwcCJ9.TANCZGx9Qm7FTBgk0knbYLvWtOcauZdi7kiIuar3wGYslLO58PGwyFB04jLprRcD_itaW08LxGo1cj_HzPvo6Bw",
      json: {
        header: "eyJmaWQiOiA4Njk5OTksICJ0eXBlIjogImN1c3RvZHkiLCAia2V5IjogIjB4N0Q0MDBGRDFGNTkyYkI0RkNkNmEzNjNCZkQyMDBBNDNEMTY3MDRlNyJ9",
        payload: "eyJkb21haW4iOiAiaGVsbG5vZXRoLW1lbWUtZnJhbWUudmVyY2VsLmFwcCJ9",
        signature: "TANCZGx9Qm7FTBgk0knbYLvWtOcauZdi7kiIuar3wGYslLO58PGwyFB04jLprRcD_itaW08LxGo1cj_HzPvo6Bw"
      }
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
