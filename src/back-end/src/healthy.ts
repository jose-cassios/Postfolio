import { app } from "./app";

export default async (req: any, res: any) => {
  try {
    await app.ready();
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      status: "unhealthy",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};
