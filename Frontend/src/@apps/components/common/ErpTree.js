import { ErpInput } from "@apps/components/common/ErpField"
import { useMergedState } from "@apps/utility/common"
import { Tree } from "antd"
import classNames from "classnames"
import { isEmpty } from "lodash"
import { Fragment, useEffect, useMemo, useState } from "react"
import DefaultSpinner from "../spinner/DefaultSpinner"
import { EmptyContent } from "./EmptyContent"
import PerfectScrollbar from "react-perfect-scrollbar"
export const title2Slug = (title) => {
  let slug = ""
  slug = title.toLowerCase()
  slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, "a")
  slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, "e")
  slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, "i")
  slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, "o")
  slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, "u")
  slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, "y")
  slug = slug.replace(/đ/gi, "d")
  slug = slug.replace(
    /\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi,
    ""
  )
  slug = slug.replace(/ /gi, "-")
  slug = slug.replace(/\-\-\-\-\-/gi, "-")
  slug = slug.replace(/\-\-\-\-/gi, "-")
  slug = slug.replace(/\-\-\-/gi, "-")
  slug = slug.replace(/\-\-/gi, "-")
  slug = "@" + slug + "@"
  slug = slug.replace(/\@\-|\-\@|\@/gi, "")
  return slug
}

export const getParentKey = (key, tree) => {
  let parentKey

  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]

    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }

  return parentKey
}

const generateList = (data) => {
  const dataList = []
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    dataList.push(node)

    if (node.children) {
      dataList.push(...generateList(node.children))
    }
  }
  return dataList
}

const ErpTree = (props) => {
  const {
    treeData,
    onCheck,
    loading,
    defaultExpandAll,
    defaultValue,
    withScroll,
    ...rest
  } = props
  const [state, setState] = useMergedState({
    dataList: []
  })
  const [expandedKeys, setExpandedKeys] = useState([])
  const [checkedKeys, setCheckedKeys] = useState([])
  const [autoExpandParent, setAutoExpandParent] = useState(true)
  const [searchValue, setSearchValue] = useState("")
  const onExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue)
    setAutoExpandParent(false)
  }

  const onCheckVal = (checkedKeysValue, event) => {
    setCheckedKeys(checkedKeysValue)
    if (_.isFunction(onCheck)) {
      onCheck(checkedKeysValue, event)
    }
  }
  useEffect(() => {
    const dataList = generateList(treeData)
    setState({
      dataList: dataList
    })
    if (defaultExpandAll && !isEmpty(dataList)) {
      const listKeys = _.map(dataList, (item) => item.key)
      setExpandedKeys(listKeys)
    }
    setCheckedKeys(defaultValue)
  }, [treeData])

  const onChange = (e) => {
    const value = title2Slug(e.target.value)

    const newExpandedKeys = state.dataList
      .map((item) => {
        const title = title2Slug(item.title)
        if (title.indexOf(value) > -1) {
          return getParentKey(item.key, treeData)
        }
        return null
      })
      .filter((item, i, self) => item && self.indexOf(item) === i)
    setExpandedKeys(newExpandedKeys)
    setSearchValue(value)
    setAutoExpandParent(true)
  }

  const data = useMemo(() => {
    const loop = (data) =>
      data.map((item) => {
        const strTitle = item.title
        const searchTitle = title2Slug(item.title)
        const index = searchTitle.indexOf(searchValue)
        const title = (
          <div
            className={classNames("d-flex p-10", {
              "site-tree-search-value text-primary":
                index > -1 && !isEmpty(searchValue)
            })}>
            <div>{strTitle}</div>
          </div>
        )

        if (item.children) {
          return {
            title,
            key: item.key,
            children: loop(item.children)
          }
        }

        return {
          title,
          key: item.key
        }
      })
    return loop(treeData)
  }, [searchValue, treeData])

  const renderTree = () => {
    return (
      <Tree
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={onCheckVal}
        checkedKeys={checkedKeys}
        selectable={false}
        treeData={data}
        defaultExpandParent={true}
        defaultExpandAll={defaultExpandAll}
        {...rest}
      />
    )
  }

  return (
    <Fragment>
      <ErpInput
        prepend={<i className="iconly-Search icli"></i>}
        onChange={onChange}
        name="search_field"
        placeholder="Search"
        label="Search"
        nolabel
        formGroupClass="mb-1"
      />
      {loading ? (
        <DefaultSpinner />
      ) : _.isEmpty(treeData) ? (
        <EmptyContent />
      ) : (
        <Fragment>
          {withScroll ? (
            <PerfectScrollbar
              style={withScroll}
              options={{ wheelPropagation: false }}>
              {renderTree()}
            </PerfectScrollbar>
          ) : (
            renderTree()
          )}
        </Fragment>
      )}
    </Fragment>
  )
}
export default ErpTree
ErpTree.defaultProps = {
  treeData: []
}