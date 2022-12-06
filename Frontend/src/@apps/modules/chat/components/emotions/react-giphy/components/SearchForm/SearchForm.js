// @flow
import React from "react"
import { useStyle } from "../../style"
import { styles } from "./searchFormStyles"

const SearchForm = ({
  onSubmit,
  placeholder,
  searchFormClassName,
  setValue,
  value,
  autoFocus
}) => {
  useStyle("SearchForm", styles)

  return (
    <>
      <input
        data-testid="SearchFormInput"
        type="text"
        placeholder={placeholder}
        onChange={setValue}
        value={value}
        name="search"
        className="reactGiphySearchbox-searchForm-input"
        autoFocus={autoFocus}
      />
      {/* <form
        data-testid="SearchFormForm"
        onSubmit={onSubmit}
        autoComplete="off"
        className={`reactGiphySearchbox-searchForm-form${
          searchFormClassName ? ` ${searchFormClassName}` : ""
        }`}>
        <input
          data-testid="SearchFormInput"
          type="text"
          placeholder={placeholder}
          onChange={setValue}
          value={value}
          name="search"
          className="reactGiphySearchbox-searchForm-input"
          autoFocus={autoFocus}
        />
      </form> */}
    </>
  )
}
export default SearchForm
