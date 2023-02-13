import { _uploadServices } from "#app/services/upload.js"
import path from "path"

export const uploadAttachmentController = async (req, res, next) => {
  const file = req.files
  const result = await _uploadServices(path.join("feed_temp", "post"), file)
  console.log(result)
  return res.respond("Thanks god, it's uploadAttachmentController!!!")
}
