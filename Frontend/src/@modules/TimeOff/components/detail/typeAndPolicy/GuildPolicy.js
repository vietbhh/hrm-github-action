const GuildPolicy = (props) => {
  const { lang } = props;
  if (lang === "en") {
    return (
      <div className="pl-2 guild-policy">
        <h4>Guide Policy</h4>
        <h6 className="mt-2">Time Off</h6>
        <p className="mb-2">
          Create any time off types to fit your company’s needs by setting up
          these options:
        </p>
        <p>
          <b>Type Name:</b> A descriptive name for this type
        </p>
        <p>
          <b>Paid or Unpaid</b>: Paid time-off (PTO) is an employer-provided
          benefit that grants employees compensation, while Unpaid time-off
          (UTO) is time away from work an employee can take without pay
        </p>
        <p>
          <b>Entitlement:</b> the number of days that are given to employees per
          year of this type
        </p>
        <p>
          <b>Accrual Frequency:</b> If all Entitlement days are accrued at the
          beginning of every year, choose “Yearly”. If 1/12 of Entitlement days
          are accrued at the beginning of every month, choose “Monthly”
        </p>
        <p>
          <b>Maximum Carry Over:</b> the maximum number of days of this type
          that can be carried over to the next calendar year
        </p>
        <p>
          <b>Carry Over Expiration:</b> the date at which all number of days
          that were accrued during the current year will no longer be usable
        </p>
        <p>
          <b>Prorate Accrual:</b> Entitlement for each employee will be
          proportional to their actual working days.
        </p>
      </div>
    );
  }
};

export default GuildPolicy;
