import AppSpinner from "@apps/components/spinner/AppSpinner"
import React, { Fragment } from "react"
import { Navigate, useParams } from "react-router-dom"

const User = () => {
  const params = useParams()
  const { identity } = params

  if (_.isEmpty(identity)) {
    return (
      <Fragment>
        <AppSpinner />
        <Navigate to="/not-found" replace />
      </Fragment>
    )
  }

  return (
    <Fragment>
      <AppSpinner />
      <Navigate to={`/employees/u/${identity}`} replace />
    </Fragment>
  )
}

export default User
