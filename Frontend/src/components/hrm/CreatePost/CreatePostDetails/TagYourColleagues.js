import { EmptyContent } from "@apps/components/common/EmptyContent"
import { ErpCheckbox, ErpInput } from "@apps/components/common/ErpField"
import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Tooltip } from "antd"
import React, { Fragment, useEffect } from "react"
import PerfectScrollbar from "react-perfect-scrollbar"
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"

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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.78906 6.75C5.78906 4.40614 7.6952 2.5 10.0391 2.5C12.3826 2.5 14.2885 4.40562 14.2891 6.74903C14.2796 9.04858 12.4859 10.9052 10.2 10.99H10.2H10.2H10.2H10.1999H10.1999H10.1999H10.1999H10.1998H10.1998H10.1998H10.1997H10.1997H10.1997H10.1996H10.1996H10.1996H10.1996H10.1995H10.1995H10.1995H10.1994H10.1994H10.1994H10.1994H10.1993H10.1993H10.1993H10.1992H10.1992H10.1992H10.1992H10.1991H10.1991H10.1991H10.199H10.199H10.199H10.1989H10.1989H10.1989H10.1989H10.1988H10.1988H10.1988H10.1987H10.1987H10.1987H10.1987H10.1986H10.1986H10.1986H10.1985H10.1985H10.1985H10.1984H10.1984H10.1984H10.1984H10.1983H10.1983H10.1983H10.1982H10.1982H10.1982H10.1981H10.1981H10.1981H10.1981H10.198H10.198H10.198H10.1979H10.1979H10.1979H10.1979H10.1978H10.1978H10.1978H10.1977H10.1977H10.1977H10.1976H10.1976H10.1976H10.1975H10.1975H10.1975H10.1975H10.1974H10.1974H10.1974H10.1973H10.1973H10.1973H10.1972H10.1972H10.1972H10.1971H10.1971H10.1971H10.1971H10.197H10.197H10.197H10.1969H10.1969H10.1969H10.1968H10.1968H10.1968H10.1967H10.1967H10.1967H10.1966H10.1966H10.1966H10.1965H10.1965H10.1965H10.1964H10.1964H10.1964H10.1963H10.1963H10.1963H10.1963H10.1962H10.1962H10.1962H10.1961H10.1961H10.1961H10.196H10.196H10.1959H10.1959H10.1959H10.1958H10.1958H10.1958H10.1957H10.1957H10.1957H10.1956H10.1956H10.1956H10.1955H10.1955H10.1955H10.1954H10.1954H10.1954H10.1953H10.1953H10.1953H10.1952H10.1952H10.1951H10.1951H10.1951H10.195H10.195H10.195H10.1949H10.1949H10.1949H10.1948H10.1948H10.1947H10.1947H10.1947H10.1946H10.1946H10.1946H10.1945H10.1945H10.1944H10.1944H10.1944H10.1943H10.1943H10.1942H10.1942H10.1942H10.1941H10.1941H10.194H10.194H10.194H10.1939H10.1939H10.1938H10.1938H10.1938H10.1937H10.1937H10.1936H10.1936H10.1936H10.1935H10.1935H10.1934H10.1934H10.1933H10.1933H10.1933H10.1932H10.1932H10.1931H10.1931H10.1931H10.193H10.193H10.1929H10.1929H10.1928H10.1928H10.1927H10.1927H10.1927H10.1926H10.1926H10.1925H10.1925H10.1924H10.1924H10.1923H10.1923H10.1922H10.1922H10.1922H10.1921H10.1921H10.192H10.192H10.1919H10.1919H10.1918H10.1918H10.1917H10.1917H10.1916H10.1916H10.1915H10.1915H10.1914H10.1914H10.1913H10.1913H10.1912H10.1912H10.1911H10.1911H10.191H10.191H10.1909H10.1909H10.1908H10.1908H10.1907H10.1907H10.1906H10.1906H10.1905H10.1905H10.1904H10.1904H10.1903H10.1902H10.1902H10.1901H10.1901H10.19H10.19H10.1899H10.1899H10.1898H10.1897H10.1897H10.1896H10.1896H10.1895H10.1895H10.1894H10.1894H10.1893H10.1892H10.1892H10.1891H10.1891H10.1889H10.1888H10.1887H10.1886H10.1885H10.1884H10.1882H10.1881H10.188H10.1879H10.1878H10.1877H10.1876H10.1874H10.1873H10.1872H10.1871H10.187H10.1869H10.1868H10.1867H10.1865H10.1864H10.1863H10.1862H10.1861H10.186H10.1859H10.1858H10.1856H10.1855H10.1854H10.1853H10.1852H10.1851H10.185H10.1849H10.1848H10.1847H10.1845H10.1844H10.1843H10.1842H10.1841H10.184H10.1839H10.1838H10.1837H10.1836H10.1835H10.1834H10.1833H10.1832H10.183H10.1829H10.1828H10.1827H10.1826H10.1825H10.1824H10.1823H10.1822H10.1821H10.182H10.1819H10.1818H10.1817H10.1816H10.1815H10.1814H10.1813H10.1812H10.1811H10.181H10.1809H10.1808H10.1806H10.1805H10.1804H10.1803H10.1802H10.1801H10.18H10.1799H10.1798H10.1797H10.1796H10.1795H10.1794H10.1793H10.1792H10.1791H10.179H10.1789H10.1788H10.1787H10.1786H10.1785H10.1784H10.1783H10.1782H10.1781H10.178H10.1779H10.1778H10.1777H10.1777H10.1776H10.1775H10.1774H10.1773H10.1772H10.1771H10.177H10.1769H10.1768H10.1767H10.1766H10.1765H10.1764H10.1763H10.1762H10.1761H10.176H10.1759H10.1758H10.1757H10.1756H10.1755H10.1754H10.1753H10.1752H10.1751H10.1751H10.175H10.1749H10.1748H10.1747H10.1746H10.1745H10.1744H10.1743H10.1742H10.1741H10.174H10.1739H10.1738H10.1737H10.1736H10.1736H10.1735H10.1734H10.1733H10.1732H10.1731H10.173H10.1729H10.1728C10.0823 10.9796 9.98824 10.9808 9.90159 10.989C7.56444 10.8911 5.78906 9.03575 5.78906 6.75Z" fill="#A279EF" stroke="#A279EF"/>
            <path d="M5.23872 20.1748L5.23735 20.1739C4.0784 19.4012 3.5 18.4016 3.5 17.3799C3.5 16.3578 4.07876 15.3484 5.24704 14.5661C6.5536 13.7017 8.29181 13.2549 10.0525 13.2549C11.8138 13.2549 13.5467 13.702 14.8426 14.5659C15.998 15.3362 16.5709 16.3355 16.58 17.3619C16.5792 18.3934 16.0003 19.3927 14.8409 20.1751C13.54 21.0483 11.8028 21.4999 10.04 21.4999C8.27705 21.4999 6.5396 21.0482 5.23872 20.1748Z" fill="#A279EF" stroke="#A279EF"/>
            <path d="M17.6676 4.05275L16.4085 4.25263C15.7235 4.36135 15.3545 5.11728 15.6901 5.72418L16.2966 6.82094C16.3953 6.99952 16.5464 7.14362 16.7294 7.23388L19.4791 8.59002C19.948 8.82131 20.516 8.65227 20.7822 8.20219L21.469 7.04076C21.7586 6.55112 21.5819 5.91888 21.0805 5.65025L18.2966 4.15891C18.1042 4.05581 17.8833 4.01853 17.6676 4.05275Z" fill="#A279EF"/>
            <circle cx="17.5" cy="5.5" r="0.5" fill="white"/>
          </svg>

        </li>
      </Tooltip>

      <Modal
        isOpen={modal}
        toggle={() => toggleModal()}
        className="modal-dialog-centered feed modal-lg modal-reaction-detail modal-poll-vote modal-tag-your-colleagues"
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}
        footer = {null}
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
                    prepend={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="vuesax/linear/search-normal">
                        <g id="search-normal">
                        <path id="Vector" d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z" stroke="#696760" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path id="Vector_2" d="M22 22L20 20" stroke="#696760" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </g>
                        </g>
                        </svg>
                    }
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
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g id="vuesax/linear/close-circle">
                                  <g id="close-circle">
                                    <path id="Vector" d="M6 18L18 6" stroke="#696760" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path id="Vector_2" d="M18 18L6 6" stroke="#696760" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                  </g>
                                </g>
                              </svg>
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
            {/* <button
              type="button"
              className="button-cancel me-1 btn"
              onClick={() => toggleModal()}>
              {useFormatMessage("app.close")}
            </button> */}
            <button
              type="button"
              className="button-save btn"
              onClick={() => {
                setTagYourColleagues(state.data_tag)
                toggleModal()
              }}>
              {useFormatMessage("modules.feed.create_post.text.save")}
            </button>
          </div>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default TagYourColleagues
