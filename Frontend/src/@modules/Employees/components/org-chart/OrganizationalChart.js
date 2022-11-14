import { downloadApi } from "@apps/modules/download/common/api"
import noavt from "assets/images/erp/noavt.png"
import { isEmpty } from "lodash-es"
import React from "react"
import OrgChart from "."

export default class OrganizationalChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      downloadingChart: false,
      config: {},
      highlightPostNumbers: [1]
    }
  }
  getChild = async (id) => {
    let result = []
    await this.props.loadData(id).then((res) => {
      result = res.data
    })
    return result
  }

  getAvt = async (avt) => {
    if (isEmpty(avt)) {
      return noavt
    } else {
      let r = ""
      await downloadApi.getAvatar(avt).then((response) => {
        const imgUrl = response.data
        r = URL.createObjectURL(imgUrl)
      })
      return r
    }
  }

  handleDownload = () => {
    this.setState({ downloadingChart: false })
  }

  handleOnChangeConfig = (config) => {
    this.setState({ config: config })
  }

  handleLoadConfig = () => {
    const { config } = this.state
    return config
  }

  render() {
    //For downloading org chart as image or pdf based on id
    const downloadImageId = "download-image"
    const downloadPdfId = "download-pdf"
    return (
      <React.Fragment>
        <OrgChart
          tree={this.props.tree}
          id="org-chart"
          downloadImageId={downloadImageId}
          downloadPdfId={downloadPdfId}
          onConfigChange={(config) => {
            this.handleOnChangeConfig(config)
          }}
          loadConfig={(d) => {
            const configuration = this.handleLoadConfig(d)
            if (configuration) {
              return configuration
            }
          }}
          downlowdedOrgChart={(d) => {
            this.handleDownload()
          }}
          loadImage={(d) => {
            return Promise.resolve(this.getAvt(d.person.avatar))
          }}
          loadChildren={(d) => {
            return d.hasChild ? this.getChild(d.id) : []
          }}
        />
      </React.Fragment>
    )
  }
}
