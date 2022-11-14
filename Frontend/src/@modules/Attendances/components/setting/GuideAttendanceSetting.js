const GuideAttendanceSetting = (props) => {
    const { lang } = props;

    if (lang === "en") {
        return (
            <div className="guide_setting">
                <h3>Guide E</h3>
                <div className="mt-1">
                    <h4>Time Attendance</h4>
                    <div className="content">
                        Keeps track of employees’ working hours, clock in and
                        out time, and which task they were doing. Time
                        Attendance can be used with Payroll to calculate salary
                        automatically.
                    </div>
                </div>
                <div className="size-md">
                    <h4 className="mt-2">
                        When enabling Geofencing, Admin should:
                    </h4>
                    <div className="content size-sm mt-1">
                        1. Choose the method that is going to be applied to each
                        office (please read the tooltip of each method for more
                        detail).
                    </div>
                    <div className="content">
                        2. Input the accurate address and radius to form the
                        geofencing.
                    </div>
                    <div className="content size-sm mt-1">
                        Then each time the employee Clock In / Clock Out, system
                        will show whether the Employee is Inside / Outside the
                        designated area. In some cases when Employee location
                        cannot be retrieved, the Clock In / Clock Out will be
                        flagged as N/A.
                    </div>
                </div>
                <h4 className="mt-2">
                    Additional instructions.
                    <a href="#" type="primary" className="type-primary size-md">
                        Click here
                    </a>
                </h4>
            </div>
        );
    }
};

export default GuideAttendanceSetting;
