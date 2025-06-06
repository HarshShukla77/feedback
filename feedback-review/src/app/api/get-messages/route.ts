import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  console.log("✅ SESSION in /api/messages:", session);

  if (!session || !session.user || !session.user._id) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const userId = new mongoose.Types.ObjectId(session.user._id);

    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    console.log("✅ Aggregated Messages:", user[0]?.messages || []);

    return Response.json(
      { success: true, messages: user[0]?.messages || [] },
      { status: 200 }
    );
  } catch (err: any) {
    console.log("❌ ERROR in get-messages:", err.message);
    return Response.json(
      { success: false, message: err.message || "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
