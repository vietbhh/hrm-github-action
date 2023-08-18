import cover0 from "@modules/FriNet/assets/images/badge/cover0.png"
import cover1 from "@modules/FriNet/assets/images/badge/cover1.png"
import cover2 from "@modules/FriNet/assets/images/badge/cover2.png"
import cover3 from "@modules/FriNet/assets/images/badge/cover3.png"
import cover4 from "@modules/FriNet/assets/images/badge/cover4.png"
import cover5 from "@modules/FriNet/assets/images/badge/cover5.png"

export const iconEndorsement = (
  <svg
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.25 18.75H9C7.9 18.75 7 19.65 7 20.75V21H6C5.59 21 5.25 21.34 5.25 21.75C5.25 22.16 5.59 22.5 6 22.5H18C18.41 22.5 18.75 22.16 18.75 21.75C18.75 21.34 18.41 21 18 21H17V20.75C17 19.65 16.1 18.75 15 18.75H12.75V16.46C12.5 16.49 12.25 16.5 12 16.5C11.75 16.5 11.5 16.49 11.25 16.46V18.75Z"
      fill="#FF6F2C"
    />
    <path
      d="M18.48 12.14C19.14 11.89 19.72 11.48 20.18 11.02C21.11 9.99 21.72 8.76 21.72 7.32C21.72 5.88 20.59 4.75 19.15 4.75H18.59C17.94 3.42 16.58 2.5 15 2.5H9.00003C7.42003 2.5 6.06003 3.42 5.41003 4.75H4.85003C3.41003 4.75 2.28003 5.88 2.28003 7.32C2.28003 8.76 2.89003 9.99 3.82003 11.02C4.28003 11.48 4.86003 11.89 5.52003 12.14C6.56003 14.7 9.06003 16.5 12 16.5C14.94 16.5 17.44 14.7 18.48 12.14ZM14.84 8.95L14.22 9.71C14.12 9.82 14.05 10.04 14.06 10.19L14.12 11.17C14.16 11.77 13.73 12.08 13.17 11.86L12.26 11.5C12.12 11.45 11.88 11.45 11.74 11.5L10.83 11.86C10.27 12.08 9.84003 11.77 9.88003 11.17L9.94003 10.19C9.95003 10.04 9.88003 9.82 9.78003 9.71L9.16003 8.95C8.77003 8.49 8.94003 7.98 9.52003 7.83L10.47 7.59C10.62 7.55 10.8 7.41 10.88 7.28L11.41 6.46C11.74 5.95 12.26 5.95 12.59 6.46L13.12 7.28C13.2 7.41 13.38 7.55 13.53 7.59L14.48 7.83C15.06 7.98 15.23 8.49 14.84 8.95Z"
      fill="#FF6F2C"
    />
  </svg>
)

export const listCoverEndorsement = [
  { key: 0, key_cover: "cover0", cover: cover0 },
  { key: 1, key_cover: "cover1", cover: cover1 },
  { key: 2, key_cover: "cover2", cover: cover2 },
  { key: 3, key_cover: "cover3", cover: cover3 },
  { key: 4, key_cover: "cover4", cover: cover4 },
  { key: 5, key_cover: "cover5", cover: cover5 }
]

export const getKeyCoverEndorsement = (keyNumber) => {
  const index = listCoverEndorsement.findIndex((item) => item.key === keyNumber)
  return index === -1 ? "" : listCoverEndorsement[index]["key_cover"]
}

export const getCoverEndorsementByKey = (keyCover) => {
  const index = listCoverEndorsement.findIndex(
    (item) => item.key_cover === keyCover
  )
  return index === -1 ? "" : listCoverEndorsement[index]["cover"]
}

export const getKeyNumberCoverEndorsementByKeyCover = (keyCover) => {
  const index = listCoverEndorsement.findIndex(
    (item) => item.key_cover === keyCover
  )
  return index === -1 ? 0 : listCoverEndorsement[index]["key"]
}

export const iconDateEndorsement = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="33"
    height="33"
    viewBox="0 0 33 33"
    fill="none">
    <path
      d="M11 2.75V6.875"
      stroke="#32434F"
      strokeOpacity="0.8"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 2.75V6.875"
      stroke="#32434F"
      strokeOpacity="0.8"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.8125 12.4987H28.1875"
      stroke="#32434F"
      strokeOpacity="0.8"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M28.875 11.6875V23.375C28.875 27.5 26.8125 30.25 22 30.25H11C6.1875 30.25 4.125 27.5 4.125 23.375V11.6875C4.125 7.5625 6.1875 4.8125 11 4.8125H22C26.8125 4.8125 28.875 7.5625 28.875 11.6875Z"
      stroke="#32434F"
      strokeOpacity="0.8"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21.5803 18.8375H21.5927"
      stroke="#32434F"
      strokeOpacity="0.8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21.5803 22.9625H21.5927"
      stroke="#32434F"
      strokeOpacity="0.8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.4934 18.8375H16.5058"
      stroke="#32434F"
      strokeOpacity="0.8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.4934 22.9625H16.5058"
      stroke="#32434F"
      strokeOpacity="0.8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.4046 18.8375H11.4169"
      stroke="#32434F"
      strokeOpacity="0.8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.4046 22.9625H11.4169"
      stroke="#32434F"
      strokeOpacity="0.8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
