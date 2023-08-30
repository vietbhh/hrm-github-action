import dayjs from "dayjs"

export const getListEventRepeat = (listEvent, query) => {
  const createdAtTo =
    query["created_at_to"] !== undefined
      ? new Date(
          dayjs(query["created_at_to"]).add(2, "dates").format("YYYY-MM-DD")
        )
      : new Date(dayjs().add(2, "dates").format("YYYY-MM-DD"))
  const result = []

  listEvent.map((item) => {
    const repeat = item.repeat
    const dayBetween = dayjs(item.start_time_date).diff(
      item.end_time_date,
      "day"
    )
    const endTimeRepeat = repeat.end_time
    if (repeat.value === "repeat_every_day") {
      const today = new Date(item.start_time_date)

      let loopTime = 0
      for (
        let day = today;
        day <= createdAtTo;
        day.setDate(day.getDate() + 1)
      ) {
        const date = dayjs(day)
        const endDate = date.add(dayBetween, "day")
        result.push({
          ...item,
          start_time_date: date.format("YYYY-MM-DD"),
          end_time_date: endDate.format("YYYY-MM-DD")
        })

        loopTime += 1
      }
    } else if (repeat.value === "repeat_every_weekday_on") {
      const today = new Date(item.start_time_date)
      const weekDay = repeat.week_day
      for (
        let day = today;
        day <= createdAtTo;
        day.setDate(day.getDate() + 1)
      ) {
        const weekDayLoop = dayjs(day).day()
        if (parseInt(weekDayLoop) === parseInt(weekDay)) {
          const date = dayjs(day)
          const endDate = date.add(dayBetween, "day")
          result.push({
            ...item,
            start_time_date: date.format("YYYY-MM-DD"),
            end_time_date: endDate.format("YYYY-MM-DD")
          })
        }
      }
    } else if (repeat.value === "repeat_every_month_on") {
      const today = new Date(item.start_time_date)
      for (
        let day = today;
        day <= createdAtTo;
        day.setDate(day.getDate() + 1)
      ) {
        const date = dayjs(day)
        const endDate = date.add(dayBetween, "day")
        if (parseInt(date.format("DD")) === parseInt(repeat.date_in_month)) {
          result.push({
            ...item,
            start_time_date: date.format("YYYY-MM-DD"),
            end_time_date: endDate.format("YYYY-MM-DD")
          })
        }
      }
    } else if (repeat.value === "repeat_on_week_day_num_every_month") {
      const today = new Date(item.start_time_date)
      for (
        let day = today;
        day <= createdAtTo;
        day.setDate(day.getDate() + 1)
      ) {
        const date = dayjs(day)
        const dayInWeek = date.day()
        const orderInMonth = Math.ceil(parseInt(date.format("DD")) / 7)
        if (
          parseInt(dayInWeek) === parseInt(repeat.week_day) &&
          parseInt(orderInMonth) === parseInt(repeat.order_week_date_in_month)
        ) {
          const endDate = date.add(dayBetween, "day")
          result.push({
            ...item,
            start_time_date: date.format("YYYY-MM-DD"),
            end_time_date: endDate.format("YYYY-MM-DD")
          })
        }
      }
    } else if (repeat.value === "customize") {
      const repeatEveryAfter = repeat.repeat_every.after
      const repeatEveryTypeOption = repeat.repeat_every.type_option
      const repeatAt = repeat.repeat_at
      if (repeatEveryTypeOption === "day") {
        const today = new Date(item.start_time_date)

        let loopTime = 0
        let loopTimeDay = 0
        for (
          let day = today;
          day <= createdAtTo;
          day.setDate(day.getDate() + 1)
        ) {
          const date = dayjs(day)

          if (
            endTimeRepeat.type_option === "on_date" &&
            !date.isBefore(dayjs(endTimeRepeat.on_date), "day")
          ) {
            break
          } else if (
            endTimeRepeat.type_option === "after" &&
            parseInt(endTimeRepeat.after) === parseInt(loopTimeDay)
          ) {
            break
          }

          if (loopTime % repeatEveryAfter === 0) {
            const endDate = date.add(dayBetween, "day")
            result.push({
              ...item,
              start_time_date: date.format("YYYY-MM-DD"),
              end_time_date: endDate.format("YYYY-MM-DD")
            })

            loopTimeDay += 1
          }

          loopTime += 1
        }
      } else if (repeatEveryTypeOption === "week") {
        const today = new Date(item.start_time_date)
        const weekDay = repeatAt.week_day
        let loopTime = 0
        let loopTimeWeek = 0
        for (
          let day = today;
          day <= createdAtTo;
          day.setDate(day.getDate() + 1)
        ) {
          const date = dayjs(day)
          const weekDayLoop = date.day()

          if (
            endTimeRepeat.type_option === "on_date" &&
            !date.isBefore(dayjs(endTimeRepeat.on_date), "day")
          ) {
            break
          } else if (
            endTimeRepeat.type_option === "after" &&
            parseInt(endTimeRepeat.after) === parseInt(loopTimeWeek)
          ) {
            break
          }

          if (
            Math.ceil(loopTime / 7) % repeatEveryAfter === 0 &&
            parseInt(weekDayLoop) === parseInt(weekDay)
          ) {
            const endDate = date.add(dayBetween, "day")
            result.push({
              ...item,
              start_time_date: date.format("YYYY-MM-DD"),
              end_time_date: endDate.format("YYYY-MM-DD")
            })
            loopTimeWeek += 1
          }

          loopTime += 1
        }
      } else if (repeatEveryTypeOption === "month") {
        const dateRepeat = repeatAt.date
        const weekDayRepeatAt = repeatAt.week_day
        const orderRepeatAt = repeatAt.order_week_date_in_month
        const today = new Date(repeatAt.date)
        if (dateRepeat !== "" && dateRepeat !== null) {
          const dayRepeat = dayjs(dateRepeat).format("DD")
          let loopTime = 0
          let loopTimeMonth = 0
          for (
            let day = today;
            day <= createdAtTo;
            day.setDate(day.getDate() + 1)
          ) {
            const date = dayjs(day)

            if (
              endTimeRepeat.type_option === "on_date" &&
              !date.isBefore(dayjs(endTimeRepeat.on_date), "day")
            ) {
              break
            } else if (
              endTimeRepeat.type_option === "after" &&
              parseInt(endTimeRepeat.after) === parseInt(loopTimeMonth)
            ) {
              break
            }

            if (date.format("DD") === dayRepeat) {
              if (loopTime % repeatEveryAfter === 0) {
                const endDate = date.add(dayBetween, "day")
                result.push({
                  ...item,
                  start_time_date: date.format("YYYY-MM-DD"),
                  end_time_date: endDate.format("YYYY-MM-DD")
                })

                loopTimeMonth += 1
              }

              loopTime += 1
            }
          }
        } else if (
          weekDayRepeatAt !== "" &&
          weekDayRepeatAt !== null &&
          orderRepeatAt !== "" &&
          orderRepeatAt !== null
        ) {
          const today = new Date(item.start_time_date)
          let loopTimeMonth = 0
          for (
            let day = today;
            day <= createdAtTo;
            day.setDate(day.getDate() + 1)
          ) {
            const date = dayjs(day)
            
            if (
              endTimeRepeat.type_option === "on_date" &&
              !date.isBefore(dayjs(endTimeRepeat.on_date), "day")
            ) {
              break
            } else if (
              endTimeRepeat.type_option === "after" &&
              parseInt(endTimeRepeat.after) === parseInt(loopTimeMonth)
            ) {
              break
            }

            const dateInMonth = date.format("DD")
            if (
              Math.ceil(parseInt(dateInMonth) / 7) ===
                parseInt(orderRepeatAt) &&
              parseInt(date.day()) === parseInt(weekDayRepeatAt)
            ) {
              const monthBetween = dayjs(today).diff(date, "month")
              if (monthBetween % repeatEveryAfter === 0) {
                const endDate = date.add(dayBetween, "day")
                result.push({
                  ...item,
                  start_time_date: date.format("YYYY-MM-DD"),
                  end_time_date: endDate.format("YYYY-MM-DD")
                })

                loopTimeMonth += 1
              }
            }
          }
        }
      }
    } else {
      result.push({ ...item })
    }
  })
  
  return result
}
