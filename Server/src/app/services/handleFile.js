import sharp from "sharp"
import fs from "fs"
import path from "path"
import {localSavePath} from "#app/services/upload.js"

const convertImageToWebp = async (files) => {
    let convertedFiles = []

    const newFiles = files.map((file) => {
        if (file.mimetype === "image/webp") {
            return {
                name: file.name,
                mimetype: file.mimetype,
                size: file.size,
                content: file.data.toString("base64")
            }
        }

        return sharp(file.data, {animated: true})
            .webp({lossless: true, nearLossless: true})
            .toBuffer()
            .then((buffer) => {
                return {
                    name: file.name.replace(/png|jpg|jpeg|gif/g, "webp"),
                    mimetype: file.mimetype.replace(/png|jpg|jpeg|gif/g, "webp"),
                    size: Buffer.byteLength(buffer, file.encoding),
                    content: buffer.toString("base64")
                }
            })
            .catch((err) => {
                throw new Error(err)
            })
    })

    await Promise.all(newFiles).then((newFiles) => {
        convertedFiles = newFiles
    })

    return convertedFiles
}

const removeDirInUpload = (pathDir) => {
    if (!fs.existsSync(path.join(localSavePath, pathDir))) {
        return
    }

    fs.rmSync(
        path.join(localSavePath, pathDir),
        {
            recursive: true
        },
        (error) => {
            if (error) {
                throw new Error("directory is not delete.")
            } else {
                return true
            }
        }
    )
}

export {convertImageToWebp, removeDirInUpload}
