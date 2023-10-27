import { EmptyContent } from "@apps/components/common/EmptyContent"
import { ErpCheckbox, ErpInput } from "@apps/components/common/ErpField"
import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Tooltip } from "antd"
import React, { Fragment, useEffect } from "react"
import PerfectScrollbar from "react-perfect-scrollbar"
import { Modal, ModalBody } from "reactstrap"

const TagYourColleagues = (props) => {
  const {
    dataMention,
    tag_your_colleagues,
    setTagYourColleagues,
    modal,
    toggleModal
  } = props
  const [state, setState] = useMergedState({
    text_search: "",
    data_tag: []
  })

  // ** function
  const handleCheckedUser = (user_id) => {
    const index_user = state.data_tag.indexOf(user_id)
    const _tag_your_colleagues = [...state.data_tag]
    if (index_user === -1) {
      _tag_your_colleagues.push(user_id)
    } else {
      _tag_your_colleagues.splice(index_user, 1)
    }

    setState({ data_tag: _tag_your_colleagues })
  }

  // ** useEffect
  useEffect(() => {
    if (modal) {
      setState({ data_tag: tag_your_colleagues })
    }
  }, [modal, tag_your_colleagues])
  return (
    <Fragment>
      <Tooltip
        title={useFormatMessage(
          "modules.feed.create_post.text.tag_your_colleagues"
        )}>
        <li
          className="create_post_footer-li cursor-pointer"
          onClick={() => toggleModal()}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9.78906 10.75C9.78906 8.40614 11.6952 6.5 14.0391 6.5C16.3826 6.5 18.2885 8.40562 18.2891 10.749C18.2796 13.0486 16.4859 14.9052 14.2 14.99H14.2H14.2H14.2H14.1999H14.1999H14.1999H14.1999H14.1998H14.1998H14.1998H14.1997H14.1997H14.1997H14.1996H14.1996H14.1996H14.1996H14.1995H14.1995H14.1995H14.1994H14.1994H14.1994H14.1994H14.1993H14.1993H14.1993H14.1992H14.1992H14.1992H14.1992H14.1991H14.1991H14.1991H14.199H14.199H14.199H14.1989H14.1989H14.1989H14.1989H14.1988H14.1988H14.1988H14.1987H14.1987H14.1987H14.1987H14.1986H14.1986H14.1986H14.1985H14.1985H14.1985H14.1984H14.1984H14.1984H14.1984H14.1983H14.1983H14.1983H14.1982H14.1982H14.1982H14.1981H14.1981H14.1981H14.1981H14.198H14.198H14.198H14.1979H14.1979H14.1979H14.1979H14.1978H14.1978H14.1978H14.1977H14.1977H14.1977H14.1976H14.1976H14.1976H14.1975H14.1975H14.1975H14.1975H14.1974H14.1974H14.1974H14.1973H14.1973H14.1973H14.1972H14.1972H14.1972H14.1971H14.1971H14.1971H14.1971H14.197H14.197H14.197H14.1969H14.1969H14.1969H14.1968H14.1968H14.1968H14.1967H14.1967H14.1967H14.1966H14.1966H14.1966H14.1965H14.1965H14.1965H14.1964H14.1964H14.1964H14.1963H14.1963H14.1963H14.1963H14.1962H14.1962H14.1962H14.1961H14.1961H14.1961H14.196H14.196H14.1959H14.1959H14.1959H14.1958H14.1958H14.1958H14.1957H14.1957H14.1957H14.1956H14.1956H14.1956H14.1955H14.1955H14.1955H14.1954H14.1954H14.1954H14.1953H14.1953H14.1953H14.1952H14.1952H14.1951H14.1951H14.1951H14.195H14.195H14.195H14.1949H14.1949H14.1949H14.1948H14.1948H14.1947H14.1947H14.1947H14.1946H14.1946H14.1946H14.1945H14.1945H14.1944H14.1944H14.1944H14.1943H14.1943H14.1942H14.1942H14.1942H14.1941H14.1941H14.194H14.194H14.194H14.1939H14.1939H14.1938H14.1938H14.1938H14.1937H14.1937H14.1936H14.1936H14.1936H14.1935H14.1935H14.1934H14.1934H14.1933H14.1933H14.1933H14.1932H14.1932H14.1931H14.1931H14.1931H14.193H14.193H14.1929H14.1929H14.1928H14.1928H14.1927H14.1927H14.1927H14.1926H14.1926H14.1925H14.1925H14.1924H14.1924H14.1923H14.1923H14.1922H14.1922H14.1922H14.1921H14.1921H14.192H14.192H14.1919H14.1919H14.1918H14.1918H14.1917H14.1917H14.1916H14.1916H14.1915H14.1915H14.1914H14.1914H14.1913H14.1913H14.1912H14.1912H14.1911H14.1911H14.191H14.191H14.1909H14.1909H14.1908H14.1908H14.1907H14.1907H14.1906H14.1906H14.1905H14.1905H14.1904H14.1904H14.1903H14.1902H14.1902H14.1901H14.1901H14.19H14.19H14.1899H14.1899H14.1898H14.1897H14.1897H14.1896H14.1896H14.1895H14.1895H14.1894H14.1894H14.1893H14.1892H14.1892H14.1891H14.1891H14.1889H14.1888H14.1887H14.1886H14.1885H14.1884H14.1882H14.1881H14.188H14.1879H14.1878H14.1877H14.1876H14.1874H14.1873H14.1872H14.1871H14.187H14.1869H14.1868H14.1867H14.1865H14.1864H14.1863H14.1862H14.1861H14.186H14.1859H14.1858H14.1856H14.1855H14.1854H14.1853H14.1852H14.1851H14.185H14.1849H14.1848H14.1847H14.1845H14.1844H14.1843H14.1842H14.1841H14.184H14.1839H14.1838H14.1837H14.1836H14.1835H14.1834H14.1833H14.1832H14.183H14.1829H14.1828H14.1827H14.1826H14.1825H14.1824H14.1823H14.1822H14.1821H14.182H14.1819H14.1818H14.1817H14.1816H14.1815H14.1814H14.1813H14.1812H14.1811H14.181H14.1809H14.1808H14.1806H14.1805H14.1804H14.1803H14.1802H14.1801H14.18H14.1799H14.1798H14.1797H14.1796H14.1795H14.1794H14.1793H14.1792H14.1791H14.179H14.1789H14.1788H14.1787H14.1786H14.1785H14.1784H14.1783H14.1782H14.1781H14.178H14.1779H14.1778H14.1777H14.1777H14.1776H14.1775H14.1774H14.1773H14.1772H14.1771H14.177H14.1769H14.1768H14.1767H14.1766H14.1765H14.1764H14.1763H14.1762H14.1761H14.176H14.1759H14.1758H14.1757H14.1756H14.1755H14.1754H14.1753H14.1752H14.1751H14.1751H14.175H14.1749H14.1748H14.1747H14.1746H14.1745H14.1744H14.1743H14.1742H14.1741H14.174H14.1739H14.1738H14.1737H14.1736H14.1736H14.1735H14.1734H14.1733H14.1732H14.1731H14.173H14.1729H14.1728C14.0823 14.9796 13.9882 14.9808 13.9016 14.989C11.5644 14.8911 9.78906 13.0357 9.78906 10.75Z"
              fill="#A279EF"
              stroke="#A279EF"
            />
            <path
              d="M9.23872 24.1748L9.23735 24.1739C8.0784 23.4012 7.5 22.4016 7.5 21.3799C7.5 20.3578 8.07876 19.3484 9.24704 18.5661C10.5536 17.7017 12.2918 17.2549 14.0525 17.2549C15.8138 17.2549 17.5467 17.702 18.8426 18.5659C19.998 19.3362 20.5709 20.3355 20.58 21.3619C20.5792 22.3934 20.0003 23.3927 18.8409 24.1751C17.54 25.0483 15.8028 25.4999 14.04 25.4999C12.2771 25.4999 10.5396 25.0482 9.23872 24.1748Z"
              fill="#A279EF"
              stroke="#A279EF"
            />
            <path
              d="M21.6676 8.05275L20.4085 8.25263C19.7235 8.36135 19.3545 9.11728 19.6901 9.72418L20.2966 10.8209C20.3953 10.9995 20.5464 11.1436 20.7294 11.2339L23.4791 12.59C23.948 12.8213 24.516 12.6523 24.7822 12.2022L25.469 11.0408C25.7586 10.5511 25.5819 9.91888 25.0805 9.65025L22.2966 8.15891C22.1042 8.05581 21.8833 8.01853 21.6676 8.05275Z"
              fill="#A279EF"
            />
            <circle cx="21.5" cy="9.5" r="0.5" fill="white" />
          </svg>
        </li>
      </Tooltip>

      <Modal
        isOpen={modal}
        toggle={() => toggleModal()}
        className="modal-dialog-centered feed modal-lg modal-reaction-detail modal-poll-vote modal-tag-your-colleagues"
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}
        /* backdrop={"static"} */
      >
        <ModalBody>
          <div className="body-header">
            <button className="btn-icon" onClick={() => toggleModal()}>
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <span className="text-title">
              {useFormatMessage(
                "modules.feed.create_post.text.tag_your_colleagues"
              )}
            </span>
          </div>
          <div className="body-content">
            <div className="div-list-member">
              <div className="list-member__header">
                <div className="text-title">
                  {useFormatMessage(
                    "modules.feed.create_post.text.list_member"
                  )}
                </div>
                <div className="list-member__input-search">
                  <ErpInput
                    nolabel
                    placeholder={useFormatMessage("app.search")}
                    prepend={<i className="fa-regular fa-magnifying-glass"></i>}
                    value={state.text_search}
                    onChange={(e) => setState({ text_search: e.target.value })}
                  />
                </div>
              </div>
              <div className="list-member__list">
                <PerfectScrollbar options={{ wheelPropagation: false }}>
                  {_.map(
                    _.filter(dataMention, (value) => {
                      if (state.text_search !== "") {
                        const _full_name = value.full_name.toLowerCase()
                        const _text_search = state.text_search.toLowerCase()
                        return (
                          _full_name.indexOf(_text_search) !== -1 ||
                          value.name.indexOf(_text_search) !== -1
                        )
                      }
                      return true
                    }),
                    (item, index) => {
                      return (
                        <Fragment key={index}>
                          <div
                            className="d-flex align-items-center list-user-react"
                            onClick={() => handleCheckedUser(item.id)}>
                            <Avatar className="img me-1" userId={item.id} />
                            <span className="name">{item?.full_name}</span>
                            <div className="ms-auto">
                              <ErpCheckbox
                                checked={state.data_tag.indexOf(item.id) !== -1}
                                onChange={(e) => {}}
                              />
                            </div>
                          </div>

                          <hr />
                        </Fragment>
                      )
                    }
                  )}
                </PerfectScrollbar>
              </div>
            </div>
            <div className="div-list-selected">
              {_.isEmpty(state.data_tag) && (
                <div className="d-flex align-items-center justify-content-center h-100">
                  <EmptyContent
                    title={useFormatMessage(
                      "modules.feed.create_post.text.no_member_selected_yet"
                    )}
                    text=""
                  />
                </div>
              )}

              {!_.isEmpty(state.data_tag) && (
                <Fragment>
                  <div className="list-member__header">
                    <div className="text-title">
                      {useFormatMessage(
                        "modules.feed.create_post.text.list_selected"
                      )}
                    </div>
                    <div className="div-member-count">
                      <i className="fa-solid fa-user me-50"></i>
                      <span>
                        {state.data_tag.length}{" "}
                        {useFormatMessage(
                          `modules.feed.create_post.text.${
                            state.data_tag.length > 1 ? "members" : "member"
                          }`
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="list-member__list">
                    {_.map(state.data_tag, (value, index) => {
                      const index_user = dataMention.findIndex(
                        (item) => item.id === value
                      )
                      let data_user = {}
                      if (index_user !== -1) {
                        data_user = dataMention[index_user]
                      }
                      return (
                        <Fragment key={index}>
                          <div className="d-flex align-items-center list-user-react">
                            <Avatar
                              className="img me-1"
                              userId={data_user?.id}
                            />
                            <span className="name">{data_user?.full_name}</span>
                            <div
                              className="ms-auto text-center"
                              style={{ width: "20px" }}
                              onClick={() => handleCheckedUser(value)}>
                              <i className="fa-solid fa-xmark"></i>
                            </div>
                          </div>
                          <hr />
                        </Fragment>
                      )
                    })}
                  </div>
                </Fragment>
              )}
            </div>
          </div>
          <div className="body-footer">
            <button
              type="button"
              className="button-cancel me-1 btn"
              onClick={() => toggleModal()}>
              {useFormatMessage("app.close")}
            </button>
            <button
              type="button"
              className="button-save btn"
              onClick={() => {
                setTagYourColleagues(state.data_tag)
                toggleModal()
              }}>
              {useFormatMessage("modules.feed.create_post.text.done")}
            </button>
          </div>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default TagYourColleagues
