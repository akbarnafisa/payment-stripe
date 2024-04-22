export async function GET(request: Request) {
  return Response.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
}
