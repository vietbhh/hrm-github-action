import { useMergedState } from "@apps/utility/common"
import { commonApi } from "@apps/utility/commonApi"
import { ContentState, convertToRaw, EditorState } from "draft-js"
import draftToHtml from "draftjs-to-html"
import htmlToDraft from "html-to-draftjs"
import { useEffect } from "react"
import { Editor as EditorDraft } from "react-draft-wysiwyg"
const Editor = (props) => {
  const { defaultValue, onDataChange, ...rest } = props

  const [state, setState] = useMergedState({
    editorState: EditorState.createEmpty()
  })

  useEffect(() => {
    setState({
      editorState: defaultValue
        ? EditorState.createWithContent(
            ContentState.createFromBlockArray(
              htmlToDraft(defaultValue).contentBlocks
            )
          )
        : EditorState.createEmpty()
    })
  }, [defaultValue])

  const onEditorStateChange = (editorStateData) => {
    setState({
      editorState: editorStateData
    })
    const data = draftToHtml(convertToRaw(editorStateData.getCurrentContent()))
    onDataChange(data)
  }

  return (
    <EditorDraft
      defaultEditorState={state.editorState}
      editorState={state.editorState}
      onEditorStateChange={onEditorStateChange}
      editorStyle={{
        minHeight: "220px",
        maxHeight: "220px"
      }}
      wrapperStyle={{
        minHeight: "270px",
        maxHeight: "270px"
      }}
      toolbar={{
        options: [
          "inline",
          "list",
          "textAlign",
          "fontSize",
          "colorPicker",
          "link",
          "embedded",
          "image"
        ],
        inline: {
          options: ["bold", "italic", "underline"]
        },
        list: {
          options: ["unordered", "ordered", "indent", "outdent"]
        },
        textAlign: {
          inDropdown: false,
          className: undefined,
          component: undefined,
          dropdownClassName: undefined,
          options: ["left", "center", "right", "justify"]
        },
        fontSize: {
          options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
          className: undefined,
          component: undefined,
          dropdownClassName: undefined
        },
        link: {
          inDropdown: false,
          className: undefined,
          component: undefined,
          popupClassName: undefined,
          dropdownClassName: undefined,
          showOpenOptionOnHover: true,
          defaultTargetOption: "_self",
          options: ["link", "unlink"],
          linkCallback: undefined
        },
        colorPicker: {
          className: undefined,
          component: undefined,
          popupClassName: undefined,
          colors: [
            "rgb(97,189,109)",
            "rgb(26,188,156)",
            "rgb(84,172,210)",
            "rgb(44,130,201)",
            "rgb(147,101,184)",
            "rgb(71,85,119)",
            "rgb(204,204,204)",
            "rgb(65,168,95)",
            "rgb(0,168,133)",
            "rgb(61,142,185)",
            "rgb(41,105,176)",
            "rgb(85,57,130)",
            "rgb(40,50,78)",
            "rgb(0,0,0)",
            "rgb(247,218,100)",
            "rgb(251,160,38)",
            "rgb(235,107,86)",
            "rgb(226,80,65)",
            "rgb(163,143,132)",
            "rgb(239,239,239)",
            "rgb(255,255,255)",
            "rgb(250,197,28)",
            "rgb(243,121,52)",
            "rgb(209,72,65)",
            "rgb(184,49,47)",
            "rgb(124,112,107)",
            "rgb(209,213,216)"
          ]
        },
        embedded: {
          className: undefined,
          component: undefined,
          popupClassName: undefined,
          embedCallback: undefined,
          defaultSize: {
            height: "auto",
            width: "auto"
          }
        },
        image: {
          className: undefined,
          component: undefined,
          popupClassName: undefined,
          urlEnabled: true,
          uploadEnabled: true,
          alignmentEnabled: true,
          uploadCallback: async (file) => {
            return new Promise((resolve, reject) => {
              const reader = new window.FileReader()
              reader.onloadend = async () => {
                await commonApi.uploadLibs(file).then((res) => {
                  const result = {
                    data: { url: res.data }
                  }
                  resolve(result)
                })
              }
              reader.readAsDataURL(file)
            })
          },
          previewImage: true,
          inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
          alt: { present: false, mandatory: false },
          defaultSize: {
            height: "auto",
            width: "auto"
          }
        }
      }}
      {...rest}
    />
  )
}
export default Editor
