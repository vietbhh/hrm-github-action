const actionsBeforeDrag = {
    interview: async (data) => {
      let interview = false;
      await recruitmentsApi
        .checkCandidateInterviewSchedule(data.recruitment_proposal, data.id)
        .then((res) => {
          interview = res.data;
        });
      let result = true;
      if (interview) {
        await SwAlert.showWarning({
          title: "Hmm...",
          html: useFormatMessage(
            "modules.recruitments.kanban.text.warning_candidate_interview_schedule",
            {
              date: formatDateTime(interview.interview_date),
              interviewer: interview.interviewer.full_name
            }
          ),
          confirmButtonText: useFormatMessage(
            "modules.recruitments.kanban.text.remove_interview_schedule"
          ),
          customClass: {
            confirmButton: "btn btn-danger"
          }
        }).then((res) => {
          result = res.value;
          if (result) {
            defaultModuleApi.delete("interviews", interview.id).then((res) => {
              //do nothing
            });
          }
        });
      }
      return result;
    },
    hired: async (data) => {
      let result = true;
      if (data.is_employed) {
        result = false;
        await SwAlert.showInfo({
          title: "Oops...",
          text: "You can't change stage of this candidate because this candidate was add as an employee."
        }).then((res) => {});
      }
      return result;
    }
  };

  const actionsAfterDrag = {
    interview: async (data) => {
      const result = await promiseModal(({ show, onSubmit, onDismiss }) => {
        return (
          <InterviewActionModal
            modal={show}
            toggleModal={onDismiss}
            onSubmit={onSubmit}
            onClosed={onDismiss}
            mailContentReplace={{
              ...replaceData,
              candidate_email: data.candidate_email,
              candidate_name: data.candidate_name,
              candidate_phone: data.candidate_phone
            }}
            candidate={data}
          />
        );
      });
      return result;
    },
    offered: async (data) => {
      const result = await promiseModal(({ show, onSubmit, onDismiss }) => {
        return (
          <OfferedActionModal
            modal={show}
            toggleModal={onDismiss}
            onSubmit={onSubmit}
            onClosed={onDismiss}
            mailContentReplace={{
              ...replaceData,
              candidate_email: data.candidate_email,
              candidate_name: data.candidate_name,
              candidate_phone: data.candidate_phone
            }}
            candidate={data}
          />
        );
      });
      return result;
    },
    rejected: async (data) => {
      const rejection_reason_options =
        modules.candidates.options.rejection_reason;
      const result = await promiseModal(({ show, onSubmit, onDismiss }) => {
        return (
          <RejectedActionModal
            modal={show}
            toggleModal={onDismiss}
            onSubmit={onSubmit}
            onClosed={onDismiss}
            mailContentReplace={{
              ...replaceData,
              candidate_email: data.candidate_email,
              candidate_name: data.candidate_name,
              candidate_phone: data.candidate_phone
            }}
            candidate={data}
            rejection_reason_options={rejection_reason_options}
          />
        );
      });
      return result;
    },
    hired: async (data) => {
      let result = true;
      await SwAlert.showInfo({
        title: "Add this candidate as an employee",
        text: "Do you want to add this candidate as an employee ?",
        showCancelButton: true,
        confirmButtonText: "Add As Employee",
        cancelButtonText: "Not Now",
        icon: "question",
        customClass: {
          cancelButton: "btn btn-outline-secondary ms-1"
        }
      }).then(async (res) => {
        if (res.value) {
          const addEmployee = await promiseModal(
            ({ show, onSubmit, onDismiss }) => {
              const employeeModule = modules.employees;
              return (
                <AddEmployeeModal
                  modal={show}
                  handleModal={onDismiss}
                  onSubmit={onSubmit}
                  onClosed={onDismiss}
                  loadData={() => {}}
                  metas={employeeModule.metas}
                  options={employeeModule.options}
                  module={employeeModule.config}
                  fillData={{
                    full_name: data.candidate_name,
                    username: data.candidate_email,
                    phone: data.candidate_phone,
                    email: data.candidate_email,
                    dob: data.candidate_dob,
                    gender: data.gender
                  }}
                />
              );
            }
          );
          if (addEmployee) {
            result = {
              is_employed: true
            };
          }
        }
      });
      return result;
    }
  };