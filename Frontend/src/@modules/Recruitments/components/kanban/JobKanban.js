import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage } from "@apps/utility/common"
import Board, { moveCard } from "@asseinfo/react-kanban"
import "@asseinfo/react-kanban/dist/styles.css"
import { isFunction } from "lodash"
import React, { useEffect, useState } from "react"
import ContentLoader from "react-content-loader"

const JobKanban = (props) => {
  const {
    loading,
    stages,
    onCandidateMove,
    actionsBeforeDrag,
    actionsAfterDrag,
    onCandidateClick,
    loadData,
    closed
  } = props
  const [controlledBoard, setBoard] = useState(stages)
  const handleCardMove = async (_card, source, destination) => {
    const currentBoard = { ...controlledBoard }
    const updatedBoard = moveCard(controlledBoard, source, destination)
    const currentCol = controlledBoard.columns
      .filter((item) => parseInt(item.id) === parseInt(source.fromColumnId))
      .shift()
    let actionBeforeResult = true
    if (isFunction(actionsBeforeDrag[currentCol.title])) {
      setBoard(updatedBoard)
      actionBeforeResult = await actionsBeforeDrag[currentCol.title](_card)
      if (!actionBeforeResult) {
        setBoard(currentBoard)
        return
      }
    }
    const targetCol = controlledBoard.columns
      .filter((item) => parseInt(item.id) === parseInt(destination.toColumnId))
      .shift()
    let actionAfterResult = true
    if (isFunction(actionsAfterDrag[targetCol.title])) {
      setBoard(updatedBoard)
      actionAfterResult = await actionsAfterDrag[targetCol.title](_card)
      let isComplete = false
      if (actionAfterResult) {
        isComplete = await onCandidateMove(
          _card,
          updatedBoard,
          source,
          destination,
          actionAfterResult
        )
      }
      if (isComplete) {
        loadData()
      }
      if (!isComplete) {
        setBoard(currentBoard)
      }
    } else {
      setBoard(updatedBoard)
      const m = await onCandidateMove(_card, updatedBoard, source, destination)
      if (m) {
        loadData()
      }
      if (!m) {
        setBoard(currentBoard)
      }
    }
  }
  useEffect(() => {
    setBoard(stages)
  }, [stages])
  return (
    <React.Fragment>
      {loading && (
        <div
          className="scaling-svg-container"
          style={{
            height: "650px",
            paddingBottom: 0
          }}>
          <ContentLoader
            speed={2}
            className="scaling-svg"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            height={600}
            style={{
              height: "600px"
            }}>
            <rect x="12" y="19" rx="0" ry="0" width="280" height="600" />
            <rect x="330" y="19" rx="0" ry="0" width="280" height="600" />
            <rect x="640" y="19" rx="0" ry="0" width="280" height="600" />
            <rect x="950" y="19" rx="0" ry="0" width="280" height="600" />
            <rect x="1260" y="19" rx="0" ry="0" width="280" height="600" />
          </ContentLoader>
        </div>
      )}
      {!loading && (
        <Board
          disableColumnDrag={true}
          disableCardDrag={closed}
          onCardDragEnd={handleCardMove}
          renderColumnHeader={({ title }) => (
            <div className="react-kanban-column-header">
              <span>
                {useFormatMessage(
                  `modules.recruitments.kanban.stages.${title}`
                )}
              </span>
            </div>
          )}
          renderCard={(candidate, { dragging, ...rest2 }) => {
            const {
              candidate_name,
              candidate_avatar,
              candidate_email,
              ...rest1
            } = candidate
            return (
              <div
                className="kanban-candidate d-flex align-items-center"
                dragging={dragging.toString()}
                onClick={() => onCandidateClick(candidate)}>
                <Avatar src={candidate_avatar} title={candidate_name} />
                <div
                  className="ms-50"
                  style={{
                    display: "grid"
                  }}>
                  <h6 className="user-name text-truncate mb-25">
                    {candidate_name}
                  </h6>
                  <small className="text-truncate candidate-email text-muted mb-0">
                    {candidate_email}
                  </small>
                </div>
              </div>
            )
          }}>
          {controlledBoard}
        </Board>
      )}
    </React.Fragment>
  )
}

JobKanban.defaultProps = {
  loading: true,
  stages: {
    columns: []
  },
  onCandidateMove: (_card, updatedBoard, source, destination) => {
    return true
  },
  onCandidateClick: () => {}
}

export default JobKanban
