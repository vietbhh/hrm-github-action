import React, { useEffect } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import { useFormatMessage } from "@apps/utility/common";
import LayoutDashboard from "./LayoutDashboard";
import { useMergedState } from '../../../../utility/common';
import { Tooltip } from "antd"
import "../../assets/css/event.scss"
import { EventApi } from '../common/api';
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import noEvent from "../../assets/images/Group.svg"
import ModalListBirthday from './ModalListBirthday';
import { useDispatch } from 'react-redux';
import { showAddEventCalendarModal } from "@apps/modules/calendar/common/reducer/calendar"
import { useNavigate } from 'react-router-dom';
import WidgetSetting from './WidgetSetting';

function CardEvent(props) {

    const [state, setState] = useMergedState({
        loading: true,
        modal: false,
        arrTick: [],
        idEvents:0,
        modalListBirthDay: false,
        options_employee_department: [],
        optionsMeetingRoom: [],
      })

      const getListEvent = () => {
        EventApi.getListEvent().then(res => {
            const birthday = res.data.results.today?.filter((event) => event.title === "birthday")
            setState({
                "events":res.data.results.today,
                "loading": false,
                "birthday": birthday,
                "number_event" : res.data.results.today.length - birthday.length,
                "total_events":  res.data.results.today.length
            })
            if (_.isFunction(props.handleLayouts)) {
                props.handleLayouts()
              }
        }).catch((err) => {
            setState({ loading: false })
            if (_.isFunction(props.handleLayouts)) {
              props.handleLayouts()
            }
          });
      }

      const toggleModal = (id = 0) => {
        setState({ modal: !state.modal, idEvents: id })
      }

      const handleModalBirthday = () => {
        setState({
            "modalListBirthDay": !state.modalListBirthDay
        })
      }

      useEffect(() => {
        if (!state.loading) {
          props.handleWidget("events", "static", { modal: state.modal })
        }
      }, [state.modal])

      const navigate = useNavigate();
      const navigateToCalender = () => {
        navigate("/calendar")
      }


      useEffect( () => {
        getListEvent()
      },[]);

      const dispatch = useDispatch()

      const toggleModalCreateEvent = () => {
        dispatch(
          showAddEventCalendarModal({
            idEvent: null,
            viewOnly: false
          })
        )
      }

    return (
        <div className='widget-events'>
            <LayoutDashboard
                headerProps={{
                    id: "events",
                    title: useFormatMessage("modules.dashboard.events.title"),
                    isRemoveWidget: true,
                    classIconBg: "notepad-bg-icon",
                    icon: (
                    <svg
                        className="icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none">
                        <path
                        d="M16.5 7.5V11.25C16.5 15 15 16.5 11.25 16.5H6.75C3 16.5 1.5 15 1.5 11.25V6.75C1.5 3 3 1.5 6.75 1.5H10.5"
                        stroke="#32434F"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        />
                        <path
                        d="M16.5 7.5H13.5C11.25 7.5 10.5 6.75 10.5 4.5V1.5L16.5 7.5Z"
                        stroke="#32434F"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        />
                        <path
                        d="M5.25 9.75H9.75"
                        stroke="#32434F"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        />
                        <path
                        d="M5.25 12.75H8.25"
                        stroke="#32434F"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        />
                    </svg>
                    ),
                    customRight: (
                    <>
                        {!props.layoutSmall && !_.isEmpty(state.arrTick) && (
                        <Tooltip title={useFormatMessage(`app.delete`)}>
                            <i
                            className="fa-solid fa-trash me-1 cursor-pointer"
                            onClick={() => deleteMultiple()}></i>
                        </Tooltip>
                        )}

                        {!props.layoutSmall && (
                        <Tooltip title={useFormatMessage(`app.add`)}>
                            <svg
                            onClick={() => toggleModalCreateEvent()}
                            className="me-1 cursor-pointer"
                            xmlns="http://www.w3.org/2000/svg"
                            width="35"
                            height="35"
                            viewBox="0 0 35 35"
                            fill="none">
                            <path
                                d="M11.6666 17.5H23.3333"
                                stroke="#32434F"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M17.5 23.3333V11.6667"
                                stroke="#32434F"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            </svg>
                        </Tooltip>
                        )}
                    </>
                    ),
                    ...props
                }}>

                <CardBody>
                    {state.loading && (
                        <div
                            style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%"
                            }}>
                            <DefaultSpinner />
                        </div>
                    )}
                    {!state.loading && state.total_events ? (
                        <>
                            {state.number_event > 0 && (
                                <div className='total-event' onClick={navigateToCalender}>
                                    <div className='icon-event'>
                                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g id="vuesax/bold/ticket">
                                            <g id="ticket">
                                            <path id="Vector" d="M20.1867 6.04514C20.4766 5.75523 20.4766 5.2744 20.1867 4.98448L19.4796 4.27738C16.3613 1.15904 14.4662 1.15904 11.3479 4.27738L6.92845 8.69679L8.51944 10.2878C8.80936 10.5777 8.80935 11.0585 8.51944 11.3484C8.22953 11.6384 7.7487 11.6384 7.45878 11.3484L5.86779 9.75745L4.2768 11.3484C1.15846 14.4668 1.15846 16.3618 4.2768 19.4802L4.63035 19.8337C4.92027 20.1236 5.4011 20.1236 5.69101 19.8337C6.36984 19.1549 7.48707 19.1549 8.16589 19.8337C8.84471 20.5125 8.84471 21.6298 8.16589 22.3086C7.87597 22.5985 7.87597 23.0793 8.16589 23.3693L8.51944 23.7228C11.6378 26.8412 13.5328 26.8412 16.6512 23.7228L18.2422 22.1318L16.6512 20.5408C16.3613 20.2509 16.3613 19.7701 16.6512 19.4802C16.9411 19.1903 17.4219 19.1903 17.7118 19.4802L19.3028 21.0712L23.7222 16.6517C26.8406 13.5334 26.8406 11.6384 23.7222 8.52002C23.4323 8.2301 22.9515 8.2301 22.6616 8.52002C21.9828 9.19884 20.8655 9.19884 20.1867 8.52002C19.5079 7.84119 19.5079 6.72396 20.1867 6.04514ZM14.6501 16.4184C14.94 16.7083 14.94 17.1891 14.6501 17.4791C14.3601 17.769 13.8793 17.769 13.5894 17.4791L10.5206 14.4102C10.2306 14.1203 10.2306 13.6395 10.5206 13.3496C10.8105 13.0596 11.2913 13.0596 11.5812 13.3496L14.6501 16.4184Z" fill="#4986FF"/>
                                            </g>
                                            </g>
                                        </svg>
                                    </div>
                                    <div className='events'>
                                        <span>
                                            {useFormatMessage("modules.dashboard.events.total_event", { number : state.number_event })}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {state.birthday?.length > 0 &&(
                                <>
                                    <div className='div-birthday' onClick={ handleModalBirthday}>
                                        <div className='icon-birthday'>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g id="vuesax/bold/cake">
                                                <g id="cake">
                                                <path id="Vector" d="M20.8894 13V14H20.0194C19.2794 14 18.6794 14.6 18.6794 15.35V15.65C18.6794 16.4 18.0794 17 17.3294 17C16.5894 17 15.9894 16.4 15.9894 15.65V15.35C15.9894 14.6 15.3794 14 14.6394 14C13.8994 14 13.2994 14.6 13.2994 15.35V15.65C13.2994 16.4 12.6894 17 11.9494 17C11.2094 17 10.5994 16.4 10.5994 15.65V15.35C10.5994 14.6 9.99938 14 9.25938 14C8.51938 14 7.90938 14.6 7.90938 15.35V15.65C7.90938 16.4 7.30938 17 6.56938 17C5.81938 17 5.21937 16.4 5.21937 15.65V15.33C5.21937 14.59 4.62938 13.99 3.89938 13.98H3.10938V13C3.10938 11.62 4.14938 10.45 5.55938 10.11C5.83938 10.04 6.12938 10 6.43938 10H17.5594C17.8694 10 18.1594 10.04 18.4394 10.11C19.8494 10.45 20.8894 11.62 20.8894 13Z" fill="#FF9149"/>
                                                <path id="Vector_2" d="M18.4405 7.17V8.58C18.1505 8.52 17.8605 8.5 17.5605 8.5H6.44055C6.14055 8.5 5.85055 8.53 5.56055 8.59V7.17C5.56055 5.97 6.64055 5 7.98055 5H16.0205C17.3605 5 18.4405 5.97 18.4405 7.17Z" fill="#FF9149"/>
                                                <path id="Vector_3" d="M8.75 3.5499V5.0099H7.98C7.72 5.0099 7.48 5.0399 7.25 5.0999V3.5499C7.25 3.1999 7.59 2.8999 8 2.8999C8.41 2.8999 8.75 3.1999 8.75 3.5499Z" fill="#FF9149"/>
                                                <path id="Vector_4" d="M16.75 3.33008V5.10008C16.52 5.03008 16.28 5.00008 16.02 5.00008H15.25V3.33008C15.25 2.92008 15.59 2.58008 16 2.58008C16.41 2.58008 16.75 2.92008 16.75 3.33008Z" fill="#FF9149"/>
                                                <path id="Vector_5" d="M12.75 2.82V5H11.25V2.82C11.25 2.37 11.59 2 12 2C12.41 2 12.75 2.37 12.75 2.82Z" fill="#FF9149"/>
                                                <path id="Vector_6" d="M22 21.25C22 21.66 21.66 22 21.25 22H2.75C2.34 22 2 21.66 2 21.25C2 20.84 2.34 20.5 2.75 20.5H3.11V15.48H3.72V15.55C3.72 16.89 4.6 18.13 5.91 18.42C6.93 18.66 7.9 18.33 8.56 17.68C8.94 17.3 9.56 17.29 9.94 17.67C10.46 18.18 11.17 18.5 11.95 18.5C12.73 18.5 13.44 18.19 13.96 17.67C14.34 17.3 14.95 17.3 15.34 17.68C15.99 18.33 16.96 18.66 17.99 18.42C19.3 18.13 20.18 16.89 20.18 15.55V15.5H20.89V20.5H21.25C21.66 20.5 22 20.84 22 21.25Z" fill="#FF9149"/>
                                                </g>
                                                </g>
                                            </svg>
                                        </div>
                                        <div className='birthday'>
                                            <span>
                                                {state.birthday[0]?.employee_info.length> 1 ? useFormatMessage("modules.dashboard.events.birthday", { member : state.birthday[0]?.employee_info[0]?.full_name, number: state.birthday[0]?.employee_info.length - 1 }) : useFormatMessage("modules.dashboard.events.one_birthday", {member: state.birthday[0]?.employee_info[0]?.full_name})}
                                            </span>
                                        </div>
                                    </div>

                                    {/* <ModalListBirthday 
                                        modal={state.modalListBirthDay}
                                        handleModalBirthday = {handleModalBirthday}
                                        member = {state.birthday[0]?.employee_info}
                                    /> */}

                                    {/* <WidgetSetting 
                                        modal={state.modalListBirthDay}
                                        handleModalWidget = {handleModalBirthday}
                                        member = {state.birthday[0]?.employee_info}
                                    /> */}
                                </>
                            )}

                        </>
                    ) : (
                        <div className='no-total-event'>
                            <div className='icon-no-event'>
                                <img src= {noEvent} alt="no-event" className='no-event-icon' />
                            </div>
                            <div className='text'>
                                <span>
                                    {useFormatMessage("modules.dashboard.events.no_event_today")}
                                </span>
                            </div>
                            
                        </div>
                    )}

                </CardBody>
            </LayoutDashboard>
        </div>
    );
}

export default CardEvent;