import type { Request, Response } from "express";
import { corsair } from '../server/corsair';

export async function listMails(req: Request, res: Response){

  const tenant = corsair.withTenant("user_abc123");

  try {
    const mails = await tenant.gmail.api.messages.list({
      maxResults: 10
    });

    console.log(mails)
    res.json(mails);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err
    });
  }
}
