"use server";
import short_url from "@/models/short_url";
import { connectToDb } from "./mongodb/connect";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function editOneById({ id, url, ali }) {
    const user = await currentUser();
    await connectToDb();
    try {
        // Get the old alias before updating
        const oldData = await short_url.findOne({ _id: id, author: user.emailAddresses[0].emailAddress });
        const oldAlias = oldData?.alias;
        
        const getAlias = await short_url.findOne({ alias: ali });
        if (getAlias) return JSON.stringify({ message: "Alias already exists!" });
        
        const data = await short_url.findByIdAndUpdate({ _id: id, author: user.emailAddresses[0].emailAddress }, { destination_url: url, alias: ali });
        
        // Revalidate cache for both old and new aliases
        if (oldAlias) {
            revalidatePath(`/api/${oldAlias}`);
        }
        if (ali && ali !== oldAlias) {
            revalidatePath(`/api/${ali}`);
        }
        
        return JSON.stringify(data);
    }
    catch (err) {
        return false;
    }
}