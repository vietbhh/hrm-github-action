// ** React Imports
import { Fragment, useState } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { workspaceApi } from "../../../common/api"
import moment from "moment"
// ** Styles
import { Button, Card, CardBody } from "reactstrap"
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"
import { Space } from "antd"

const RequestToJoinBody = (props) => {
  const {
    // ** props
    id,
    requestJoins,
    loadingPage,
    // ** methods
    setRequestJoins
  } = props

  const [loading, setLoading] = useState(false)

  const handleClickApprove = (index, member, type) => {
    setLoading(true)
    const values = {
      member_id: member.id,
      [type]: true,
      is_all: false
    }
    console.log("values", values)

    workspaceApi
      .update(id, values)
      .then((res) => {
        const currentRequestJoin = [...requestJoins][index]
        currentRequestJoin["handled_request"] = `handled_${type}`
        requestJoins[index] = currentRequestJoin
        setRequestJoins(requestJoins)
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
      })
  }

  // ** render
  const renderAction = (index, item) => {
    if (item?.handled_request !== undefined) {
      return (
        <Button.Ripple className="btn-action-secondary" disabled={true}>
          {useFormatMessage(`modules.workspace.text.${item?.handled_request}`)}
        </Button.Ripple>
      )
    }

    return (
      <Space>
        <Button.Ripple
          className="btn-action-primary"
          disabled={loading || loadingPage}
          onClick={() =>
            handleClickApprove(index, item, "approve_join_request")
          }>
          {useFormatMessage("button.approve")}
        </Button.Ripple>
        <Button.Ripple
          className="btn-action-secondary"
          disabled={loading || loadingPage}
          onClick={() =>
            handleClickApprove(index, item, "decline_join_request")
          }>
          {useFormatMessage("button.decline")}
        </Button.Ripple>
      </Space>
    )
  }

  const renderComponent = () => {
    if (requestJoins.length === 0) {
      return (
        <div className="w-100 d-flex justify-content-center mt-4">
          <div>
            <svg
              className="d-block"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              id="Layer_1"
              x="0px"
              y="0px"
              width="239px"
              height="214px"
              viewBox="0 0 239 214"
              enableBackground="new 0 0 239 214"
              xmlSpace="preserve">
              {" "}
              <image
                id="image0"
                width="239"
                height="214"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAO8AAADWCAYAAAA5BdXcAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAA CXBIWXMAAAsTAAALEwEAmpwYAABIlElEQVR42u29e3wb13Xv+1t7MHzpBT2s+JVoaFsRyDoWqNgW KZIS4Eea9pNY4Ke97bnp50Zgb5KT3iYRmCa3ye05h+DpqeM2SUnm9pGb5JTQOTc9J21ySNm5PUlj a0ACFCXHESHbkSjbMSHH8lOyoBdfAPa6f8wMCIAA3xIpcr6fjz8WZvbs2TPAj3vvtddei2CzIIYD Aee6sjIfhNhHzG4QaQCc5ukEM8fAfJKBnlueeCK81O21WTnQUjfgZuXdr3zFQ0IcJMCDSbFOD3M8 zdy29YknQkvdfpubH1u8c2Q4EHCuLy9vBVFgvnUQc2ycuem2J56IL/Xz2Ny82OKdA29+5StaCZFu Do0zXOQK/FLeigRXYJRVAMBGGsFd4jzuEhcKV8Ycn2D22gK2mS+2eGdJIeG+wRvw49S9eFVuKXqd JeJHlDPYSCO5J20B2ywAsdQNuFko1OP+ODm9cAGjV/5F+gP4TrIep9K35p4k0kqJupb62WxuTuye dxo0zeMsLx/3tze49z1wy0YfAFxNpvDypauo2eJEf+puPJW+F2WUxP30Gm4Tl7CRRjHKKt7k9XhV bsGrnCvuRxxDeEQ5k3NMplItt/zVX3Us9fMuN4LDgx4oygHTKKiZhxMMxJBOHwpW1oSWuo1LiS3e Irhcta0kRIAB5w8/UovbKsoAAH9xYgj/8tpbuK2iDH/o0vDQ+9+PMkoWreciV+A7yXpc5IrMsc+o 0fy5cEKMjFRu7OhILPVzLweCw4MeUkQXkDvSmQJznKVsW60itsVbgKqqunY2rcm/9YFb8e92uQAA J84n8PloLKds421bEPjQPXCWr8OrcjNGoWIjjeB2upwj6n9O1eAX6Q8AMObBB9Vwzvk00Lz18cdD i/0s/sCAJgT7BMiZkgiFOuriS/1+p6Pt7AutIA7O6SLmYOu2nW1L3fYbjS3ePFyuPX4IdAHAls0b 8deP1uHuMcPQ9ObIGH7wq9cRefM83hoZy1xzW0UZqnf9ISbWbc8c20gj+LDyWmaIPMoqvpX0ZHrg /OEzS3l4yxNP+BbzWfyBAU0VQgdlhpxgRkdKlrSFOmoSS/2u85mXcE1kOt3SVlnTsdTPcCOxxZuH q2rPMAjals0b8eUv/VvseuVlVFyYutzzgzHGHfvqMBj7Jf77D54CAOy473/F1jsezCmXLdJX5RZ8 J1kPwBD3n5b8LLtoYvPjj29crOcoJNwMjDhL2fy9jrrw0r7tSYLDg25SlMFC50rHk7gr/jour1uD c7dvLVZFgtPpymDl8vujdL2wrc1ZuO6t9WQLd/PmTbGyy5cT2WWS5eU4u3s33I/9Jna8dwHPPh3J nDvz/H/D6Nmf4C46nzn2dMqFV+VmAMBd4nxmuegiV+TMgwE4LwYCzsV6FlUR7YWEW1GtoKJa0UgR +qe+eLzdHxhctHsuBFJEsNDxu4bP4dNdP8LD+nE0PXkEn/z+U1h35Vqhok4Wwr/Uz3EjscWbjRQa AHz5S/8WW7ZsjjPzpbTD4bROX9m6FWd37waIsP3IEdzy8sv4qw+7sH3D2kwVz536KRyvfh/1yq8y x6y5LgBUizcz/7ZEbTFWVubEIvCZLx1vBeDLP75+twObHi3Bpo+UYK1bARECqpgY/FRgwLOk7x0A QPvyj2y5cBEPh4/lPsOVa/g3P/wp7ho+N6UGQbR/qZ/iRmKLN4/HPvYomAl/+tW/ONTY2OhxjI6e tc69/Ru/Aamq2PTqqxCpFABjvvs3De4cAf/noTiSb/RmPmcvF5Vj0kg1BnXR2/+pwICHGcH84+vc CtbXTt6Px81/EJZLLzzl3o8cOY7S8cn3NV5qtL90fAK//dMItlxI5F/iXsL233Bs8Waxt+HBxGOP PYqvf/PbOP/uRasniFnnt54+jY3xOF6//368cd99kA4HAGCt6kDIez/++OMP41sdbdi8eSO+eeIF XHrvFQDIHx5nsFwpLRbqaeUPDGgkxBSnj9I7BDbsK8l8vjKYwrXT6ZwyS98LUzj/iCXO8dISPO3d jR/87kdxfrMzc/63fxLJH0I7g8OD2tK0/8ZjizeLT37yd9uffOpfceHCRYDI43LVesbWrUtY59e/ 9RZuefll3KPrGNm8Ga82NCBZXg4AePeee/Dh33oYvdb1AE6d+AeMj76H8qwlodGs3jbbXZKB3pna NxOqonTnz3OV9YTNH58U7vjrEpf6iqxLL2EvzCynPH92T3vu9q24vG4Nuh97CFfWrTG+jyvX0Hg0 18bFQvhuZLuXElu8Jn19fX4iQiTyXKd17Dc/uu/gO9XVB/LLqqOjuEfXseHcOZzdvRtv3Hcf3rvr Lmw7dgyfKaPMEDqVHMXzx/8WW1NvZa59U27I/DvH11nK2ELab8xz2Z19TFlPuOV3SiFKjUWF9GXG hR9P5Fy3Ya+KW36nBMr6yYWHJemFCzz/yQ/tyPzb/fxLAIxeuPuxhzLH7xp+HXe88U7m82qa99ri NRFCtAJoGx0ZCYL50J133tbzv/zux93XNm1qI+ZwoWtuefllqKOjuHTnnXjfqVMou3wZa1UHvrb7 XtxqemSNjb6H5K/+CYAxfLbmv8aGhcklKAXomG/b//CLA/78eS6VGsJ1rJ8U7rs/Gocc50yZ0jsE 1tU4UHqngg27HbmVErSS9yn6H3/959e1Fw4OD7rbXjs5TIrSnX/u5Ic+mPm366XhzL8vr1uDZ++/ N/M5z3jlaR0eDFyv9i4nbPEC6O/vbyUi1NfXh2KxcGLo9IA/+B9a3EQUbmxsDEqiQ4Wuu7p1K0Y2 b8bGeBzvVFVlhtC3VZThz0yvLAD4wa9ex+D5BJ5OT/Ykef7NoY3znO/6AwOaINGef3zTo2pGuDxu CDd1mXPKJM8z0pcZPM4YfVXmnHPuVfG+PyjDpt8qCahiYtAfGNAW+70Hhwc1UhQ93w2ydDyJqjPD 2PnCSzlD52yKCRsAhKK0BocH3Yvd3uWGLV4AzOxnZkQikQ5d17VoNBogIggh2gBgy+OPh/J732R5 Oc7t3In3nTqFW0+dwsZ4HGd3784IeNcWJ37v7jux44N3ATB8ojdiFIDhuPFh5bVMXULKebn2+QOD TlUInfIstet3O1B+t5L5fP7HE1OECwBynPFm1xje7BrH6K8mDVjr3ArW1hg9sWM9gcpIUxUx/Kkv Hm9d1BevOLqQ1/YtFy7ik//4JB7Wj+PB517MWJsvm/Nc6/N4aUnGeFU6PpFveXaSoujB4UH/orZ3 mbHqxWvNdaWULUTkVFV1mJlbmbmzrm7SD5iYm0GUyL72lpdfxqZ4PPPv0itX8MZ992XO+z+6D83+ 30dFRRneHBnDxBthfEbtz+912+bb65aIidZ8A9X63Y6cJaFEXxLjr0/2qmV3K7j9s2W45XcmjVjZ Q2llPeVYpi8fT4HN80QIfuqLx6f08vOFwJ78Y/nLQ4BhuPqXjzZg5/Mv4dNdP8Inv/8USseTOd5W W85fzK/KSYrSFXzteT04POhbrDYvJ1a9eK257t69e3saGhr8ADqICABao9FowCq38Ykn4mlmryVg dXQ0I1yL259/HsmKCrxtDqHf3b4dvx74OUZGxrBWdeC2ijLcJSa9r8B8aPPjjwfn0+5PffFogAmB 7GNld+eu5V4+nsLVwVTOdWuqFIhSQumdCtRbcr1jLQOXxcipFC4fyxUSEQKf/pPj3QudBweHC1+f 3YM+e/+9eMa7G//lE4/h/OaNuCv+OgDDylwyMYHzWya9SbONVjntBTykKN1tZ08Ot5092Vrsvjcj q1q8Vq9bX18fAgBd150AfETUYv53MBqNtpvHsfXxx2NvVlW1WUPjfJRkEnf+4hd4r7ISr+/aBSWV wieUFA5+6B788CO1qNninCzMfGjz177mn0+7/YEBjUjJ6QGV9YRNj04K98rgVOEBwJXjSSTfZVw7 nUby3dyhtHOvmmPgunw8hSL4VCW5oB44WFmTAPPZ/OPZ67jjpSU4vaOy6Lz3Ve2OzL/vip8r5jZp QKSBKEhCDK6UteBVLV6r17U+K4ris8RcX18fEkJ4icinquqgruuarutaQtMOnrvvvjYC4oXqLLt8 GVX/8i+o7O9HZTQKAPi9u+/EOjXLmsvcshDhqkLo2cfyl4SS7zKuFBHexLuMt/9xDBf/NVcI+fPk QgauXNi/0KUkBkL5x07eN2nUa+w/kelR73jjnSkeVeOlJZmhc+n4BJqePALXmWFMC5FGijK4Egxa q1a8+b0uMFXMdXV18YmJiRopZa+qqrrD4Whn5rMf3r8/uOnxxysZaC4m4kIMnk+g5ejJw5u/9rWO +bbbQSKYP8/d/LHcJaELP55cEjKWjEpwa3PZlGGyRb7rZKIvOYNwDUjQgRkLTUNw284gwDnv7/SO SgztqMx8fvC5FwEYQi7EM97dmZ55/ZVreEQ/jk9+/6mZROwkIbpv9iH0qhWvEKJVSplZAiokZgDw er2JvXv3+okoRkQ+YHI9dcvjj4c2Pf54pRTCy1J2MtCbPaROlpdjfM2a2BsjY21fePkNfC4aw7Pv XNy5kHaToJzrnXtVlNxSfElo06MqSu9U4FhPWOd2TKlPWU9YN8M8GTD+CFBpnvgZlxbyLG1nX2gt FC0jsqcm82+rty22FTDf6wqYFLEl/MIvkjSIXJvBzYZj4VXcfFhCVRQlZB3L73Wz0XXdycxuIooB 6NJ1vcbr9Sas87f8p/8UBhDWdV1TVXVYUZTKurq6eCQSCRLRgWQy2fNHqtr6hcB/wEjWJv55IWUv BLkBY6hrLekAwHs/y+0x84fCV2O5oiw03C40Ty69Q+CW3y2FNP84WHNlpZQ75vsY//G157sY7C90 rnRisg1X1hl+4dnGKcDwuHq18g6cu30rzm/eiEN/8HFUnRnGg8+9mJn7PvjcixgvLclZE86GSDkA TN3EcbOwKnteIUQrM/dYS0GWmIUQ4ULlS0pKDpq9cg2AuKqq3YXKqaqqM3ObVW9jY2OQiKCqqt5/ 9DlDuIwcI8327Q+4Nc3jnG3bk1watJz4y++eFO7l46mctdpCS0YTWQaqQh5YF348PuV+ynrCxo8Y S0eilOBYZ/byjLZvPzG/kDptZ19oZcBf6FzpeBJNTx7JfH53c+H4BDtfODNlf+/pHZU49Acfz/G+ mrb3BbSb2Xi16sTb19fnhxGJMBCNRvW+vj6/NYTOXte10HVdY+agEMILAMlksomItGg0mmNttby0 Ghsbg9nHpZSHATiffMqImsFZu5QAQHGo3eXl457Ztj/UUZP47jcf9BKhbeS0sQabb1kuvUPMuGQ0 Gw8sq2fOFvj4OQYYvd/7691BzIPg8KC7WKib9VeuoenJIxkxjpeqGSEWWwqy9vdmrw0/e/+9OYas AlsHJ3EUiDRyk7CqxKvrulMI0UpEzURUQ0SHFEVpBaAJIXbquq7lX6OqajcRhSxhm8PlJgCBSCTi MevNEXg2RLS//+hzmZ1GxKLHOud2e5xEODk6Whqe67N85xu7g1dOTDSf+/ZYInuXUP4uorFfpacM hZ171VlZlvMNYe/+aBw8znGlRPrn/SUojoJLTK4zw/j9H/4EWy5MOls846nFlXVrsP7KtRzx5s9/ 85eQAOTMgQudXwmsKvFmDX9D9fX1sYmJiTAzg5nbmJlUVdXNnhlAZjjttNwkLerr62PM3EZEXbqu O/OHyxb9/f2t589f1H7wT09mjjGl97uq6vSq6j0Xx8fHW0+fOuqLx8MJl6tWc7n2BOfyPN/967qQ osoay+JdaBfRez/LFW7+PDl/OG2RbQgDgAs/NgQuVOmd73A5+Pqgu5BX1YPPvYhH9ONZro8q/uU3 G/FqpbGO23D0RKY3Pnf7VnQ/9hD+5rP/Bt2PPYRn778X3Y89lLE4W2Sv+Y6XlmAlsmrEq+u6O793 VBQlaA11GxoafETUpihKq+mYoVlGrELDaXN4nFBVdbDQcNm638jISNPItdGMVZuIAgw6yUI0gcjv ctV6AAACB0DwzPW5vv1EXXwiXVLDwKGSLWLaXUT58+BiluViAmfilvkKFwA4LaY8n2Vksji/eSP+ ++9+NCPcB597MWfX0NPe3Zl/n7t9a84Q2WLnC2cyPfXldWtyHD+mkMqdxtxMrAprs2kF7s7uHc25 7n4hRGZdor6+PjQwMBCWUuqqqvqZ+WRDQ0NomqoPAWgHUFPsfp/4xO/3uFy1MSLaz8BJCBE882I0 rGkeZ1n5RML6CojFxjTmZ701w7j6P9f+83j6MreK0qlD4ULCLWRZLiZwZrR975u182qfBRUIU5Mt 3KEdlYjs2YXxUhWl40k8HD6WI9xn7783Mxw2nDYuYsv5RE59t5xP5Ay9s9eMp8K9N3O0yRUvXnNY 201EsYaGhqB5TCOidhToVevq6uLRaLQTQDsRDU9TrwbgIICElNIH0xBV6H5QqIvT6BwaOhoEzNjQ NNHKBOeZ09EwAJw+fTRg1a1pHmc8Hk7M9Vn/puWB4Ke/3N9D0tHNk+lBsKYq1wnj2ul0QeHml7ME TqDYd//6weCCvwwS24DJPyhbzicyw9vL69bk9KqNR09MEe6z999bUNTFsHrmYnCaOhb8TEvIih82 OxyOLiJyVlRUNAMZcekADjU0NHTkl7dEycydAHzZmxOyMQUaZuYmIjpo+T+rqtqefT8AAJMnnU72 ZD4rfAAEjQCnq6pu2OWq1bLrLquYuLh9+wPu+Tzvd79eHxOq9AIUA4zNCtZSD2AIN981EjCEm1/O EC7iQk03LcqXwTJnmax0YrId+eu44yWTf0Qi9bsyIswXdSEsK3V2xI0pTQFCwcr7ehbluZaIFd3z RqPRLgA+Zo5duXLFr+t6j8PhaCeiRENDQ6DQNdY8uKGhIRCJRHqIqFvX9R6v1xvPqtcSaEtNTU0i Go3C4XC4o9HofiLyCCG8NTW5wzFFUSY/E7eByWP8mzQAustV2zY0dCzkcu3xAxx/+eWfx+b73Oa8 tOYzXzoerLhLZPbgJt/lgsItvUPkCDe7HItU07efqI/PdM9ZkvNOsueid7zxDkrHkxnDkzWXvbx+ Dc6ba71VZ4Zz3B6fvf9enN/szDFIXV63JsfSXBBGHDLdskjPtGSs2J43Go12EZFHStkM4JAQwqOq 6jAReQA0F7kmYM6DvQDQ2NgYJqKwqqqZiIzmeq4vT6C9RNRuHc8eim+v3uMGgKGhY5ljQy8eCxOQ IDJ/zEQahOiqqqprB6EV4EXJu/Odb+wOjr/DLelLnBh/XeLdH011wlBvyV1aSr7LmXJM3PLdr9fH Fu1LkZPLZEDhjQWTa7wleLXyzoxwgdz5sTWMfrXyTpy7fWvmvxmFC/SyTHtv5rmuxYoUryVcIYR3 7969oYaGhg4iGgSQIKIEM3fnr+maa7WtRNSSLT4hRAsAT39/v7uvr8/HzEEpZXP+XNlcUvLmH3cw e8BTI0My0Vkm0YSsjQ1MFABBg0R4sd5Fxyc/3PHO90dqzv9oPJ5teQYM4eYvLWUs1JI7v/eNhRmo 8glWfiiMvI0ckfpsP+aLmZ1B2Us9peNJ/PZPIznz4+nmskVIEHNL6wfu8wQra+JzvXg5suJyFfX3 97cC8GcLqa+vzyeE6BZCNO3Zs6fH9Dk+SETe+vr6mGkd1pn5UP6SDwBEo1EdQJyZfUTUlj1XLnS/ bFy/UaezxOEzpwc6UARX9Z4ggNwQM1IGh4aOLVrmu89+ZUBLJ0U7zEwKZXcr2PKxyR7XEm7qMoOA +He+ubtynrealuDwoC8/2FzVmWE8rB+fUtbqRfP36WavAU8L81kQYpIRJilDK6G3zWZFiddc/mlX FKXGEpKu65rD4RgE0JktTEvApsGpnYji9fX1TdPU28XMbdl1ZPfwhYQLAK7qPZxOJmtmmsPuqN7T Q0BO2FIGYiRlU/aQe6F85kvHg8xoveV3SlB6p+FllS/chThizIa2syc7QHQw+1i+a2QxIvW7Cm00 SIC5k4liSKdjALBSetfpWDHitXpPImrLiowxbY8aiUQ6zB44VlFRMcXIZJbxAOgmIqe1WyhrOUib Vrj31nogqWvo1MC0vZirurYVID+E0ox02g+a3CfLQIKkbBkaOhZarHf1v//JcZ9zt9q+vtahjb8u ceHHExlnDibp/d43rn/2wEICBow4zHfFz2HL+YsZn+Qr69bgVe1OxO77YME5rZkdMD7TPVcaK8ba rKrqQQBOKWU861juemsW5lrvPgBg5kQh4Q4MDBxIp9Mh033Sn0wmPbquh816MZ1wAYCk8Enmk9O1 21Vd20okAkyiaejFaBhA2FW9JwxjGK0R4IQQXa7qPfsgZdti9ML/+Zu7ez77lYHYleNJPXs9mIlb boRwAaB1285A29mTCRDlTBderbwTr1beOfuKON22GoULrKCeNxqNDjPzJSLaBsNxoldRlH2FBBaJ RDxE1EVEMSFESzqdHmTmpsbGxrBVpr+/v5WZA0TUUl9fH4pGoyFm3kBEbill77p16wKFBJ9NVfWe QYbsHDpVuNd0uWo1CDEskKw5dSp3WO1y1WokRDdneyUxx8HcPDR0LIxF4tNfHPAzoEEgfKOEm01w eFAjIYLZo41Zwxxr3bazZs7XrRBWhHhNMeoNDQ00ODjovHbtWgeAAwBCyWSyxdo4bw53WwEEALRY hidz/ruvoaHBmz0kBtBUX28slUSj0R4A+/PnvcWwhAkpK4v1lq7qPX4w/EOnj3qK1nMDjFnLgSwR 7wNmsU2PubN1287AUrd7KVkR4jV3//gbGxs9QKYXPiyE2M/MiWQy6S0rK9ufSqU6AJwUQgQsUQIZ UQ8DaGPmVgAn165d66upqUmY59oB+IQQzXv27OmZTZtcrj1+Ejh4+tTRoj2Dq3pPEAzPdOI16qrV YASd0zIHjV7Yu5jGrOVC8NcveCClj4jcYNZAtM2wHFMczGE2LMcr7rnnyoqY85q9JIDM0g0aGhoC uq4HVVXVVVXV0+m0lr/Mk4XT/H9rdhlreM3MZx0OR81089t8WMDHPHPmPwYnZiozNHQs7nZ7asYn JoJs+FMDRBoTDe7YsbvtzJnjHTPVcaN4O/K5VmIrQz2H02k+dJv3b8JzqSP4/g+FgcVb616prJie VwhxMJlMNpleVM2WxdmMeBGQUjbt3bu3J/s6XdedJSUlB6WUASFEwtxF5NN13akoSocQYj+AYoKf QlVVXUCCNCJsAMMDcBxEcQBniTmRBuKcSmVcH6uq93QwsGHo1NHm2dQPmENt05iVdTi0WMashfBW 3+cDwtjwkQMz4hLchnQyfJv320vaxpXEihBvf3+/m5kHpZSHiEjLGj63E5GPmXsBbGtoaPACuaIF cBJAkJk1IcRBIuqxjjscDv9se1vXvbUelqKbmA8zaNL1kVkz3jRpIHKCead5PAyQBsKhoVPGbqPZ YhizqJ1BvsxB5ng6lWpaiE/0Qnm77ws9RLlr1QBAcRVQGXx7KgFwTzqdbLNFvHBWhHiBjBeUh4ia JyYmwqqqdlnrsGNjYwlVVS8qiuJPp9N+ZnbDFG1jY2M4q6c9YAo9mG15ng1VVXUBBvmKzV+j0agu pTy0d+/ekOveBg9x2s0SbjAH59tjLjdj1ruRz+sMynl+eqEM4nVjdiZ3j4I3mUHymEO2iBfGivFt JqIWAAlmPmgan5BOp9uSyaTPivaYTqc7iOgkgKZUKuVjZnc0GtVVVb1IRBozexsbGz1zFa7ZAC0/ uFwel4QQTgAYejEaPv3LgY6h0wN+S7jWlsK5MHTqaBBSViLbX1iI4I6qum5rm6Hb7XHuqN4zONe6 54NkqsQoAaMEvKdAHC/PCBcA4MjyrSbyK46S4Xf6Pt/1pv5Z7Ua0b6WxYsRbX18fIyIvETnNQx4h RJeiKAfZcJSIM3NYSgkiajcFG2Dm3jVr1myct2hNmHhnfvT/nPPMMWDqkBIABgYGNFVVLxY619/f 757uvkNDx+JlJSU1YM4OteMDke5y1WpjqTE3gZ0AUF39gHuucbLmgjirblPCa6CE10A5Xg56bzLI Hd8zAV6fmwOY4irEYLlfSZbaIp4HK0a8gCHg+vr6SiJqNoe/CWbWTB9mAlBpivuQoiiVjY2NWmNj Y3AmZ4vZQExuYiVW7HwqleogIs2yhs8Gay4/UzkrITgzT+5RNbYZDrMU7VacZ4bqZ2L39Xj3F/WA ky4oU084GFw1Drk9dx8xnVMhTpeC3nZAnC4FiPxCKdHfjnxucXMAr2BWxFJRPqalOXQj78mAM50e TxQ77/V6E/39/U3MrEej0UuzsWBLKf3AzMtNFmdOD3S4XLU92WvCBLghZZPZxgQR9wCAq3pPVzqZ 7FwsA1cKKTe2A0gRMCqAdWljfvv+FDh7uAwAowL08uSOJmseTAQNEMG3+77gl+C22/b+36HFaNtK ZUX1vEuFteF+JiHU19fHzOAA7bPpgYlonxAiNFM5I2ysMccdGjoWh5Rew5oNQCKzhDR06mhw6NSx kNvtcSIrY8GOqrruuWRtKAavl5C7RyE91yA/PAauTBYUrjheDho1baXlEqxNyQGsKURd9lB6emzx LgKKkE7MMlvg3r17e4ioBoA/Go0O9/X1BZLJpKdQWWZuqaio6AGMjRTRaLTgENqc42aifQwNHYtD wBTu1GWoWCycEEBmmyIR+crKUu6FvANWHNqMhUwjVrZw5e7R4uXNofSbfZ/3L6RtKxVbvIsApcm9 44N3a9FotGs2VuOsuXkbEfmIKFioXGNjY9h00bS2Nh4uVI4VjjFRTs6joV8OeAsJ1+LUqaMxwHS9 BDA25ogt5B0wS63oyVEBer7MMGJZwnUw5K4xcHnhVKL0SglEfwXERcXuhYtgi3cRYCLnlatXewG4 iyUhK0R9fX2osbHR43A4PNOVUxTFzcyHi22IGHrxWFgAmEvOowwCBwiIzSfUbA4EDVcEMktF7zgM a/LxcijhCohzWeaVcgnZMDLF+pyp6pwK8XIJ6LIwHDwAuxcuwIo0WN1oGHC/8cbb4WQy2VFSUjIY iUSCxYQ2HAg415WXdxFRQoyMtGzs6EjMVL/p1tkzQxs62dgb2zNTfRYuV60GFn4muWCnDuXZ8m3Z S0NF26klwdsnps6FLfKMWVg3KXAiaAqo652+z++8llbaKr0zv7uVjN3zLgJEvIGZE16vN8HMnTTN 3tS1a9b4zSTd/vR9yuA7fV+4eHfqvw3fw914J/L5GXuW/v7+gkPzspKSDgKcO3bsDsyh4UEQNGba nx87es7v4IpwFj3pYLCWNAxZVePFhZuiqXPi7CWmywLi+VJgTAQqFDk4rAeK33MVYIt3ESAmp7CS fSlKD4rsR62qqgt8+eeDB+Fg4wd9Z0oDGTuaBJIAyKMQdb3d94XhNyOf8xS5XW92Ym+LWCycgJDN pCjtmfxH0+C6t9ZjbYDPOHVU7+naUbWnYz5ClvePbeStKfAmY4mI70gagn1wFNI7Yoi2yPwWwFTh OniKMUucKDeG1MfLQQStzDE1fcpqwhbv4qAxZwVVL4CrurZ1zRpHu/cRpya9I5DekeLGGoKmQOjv RP94Sg9u7ZYqxNCLx8LM3AKirhmXftLkJyBGyIodDfiJcJCFGHS5aufkLMHO9Db54TFjqWj3KOR9 44ZgN6eL97QWowIiWgG6PPlzlPcVEHu5OYRWATB6b2vsCM/ta1pZ2OJdBBhwAqk4ACSTSQ8Z2wAz GD2ZCHb+yQ78Vt0WsINn/kEDACuh1/v/D/dc2nLm9EAHETnLKiZ805Ujop1gbmMpa5C3zGXGzQoW SsVSiIvzHb6myLAqR7N6XAD8oTHw+6ZmL5S7RyEfGE2k3GMtW/d+yzOve64gVq14dV13R6NRPRKJ XIxGo4NmWk/nXOuZXGopSwCAEKJVSnkopxBR8KN1m7H9zoo5t1NNO7rnOrczl5S0acsAbmYlkfGN LoTpYjlTLzw2Gcxgdlii1SsMq3Iqa6j84CjknanC1zF6U7eO1tz60Y6OOb/IFciqFG8kEvGoqjrI zCeZuZmZW4jIZyYgA2BsFphNXWlzp9B//a9/7o5EIt1EhLVr13ZklyGinY3ujbOpbgqUJm3tKbXr na98xT/HS7fN2HbTnTMWCycIhttkQYQIuqr3dBU77UCq+LtKEXBFAOdU0OlSY+noZ2tyRQvDRVI2 jIA3p6e+AyAhiVu27v2W57Y6ewuhxapcKjJD2+QEktN1vaakpGTQjLzhS6fTWjQajUsp2/bu3Rsq VpcipLOibA2ISGfm3kJJxhhw37pljtnZ31NAbztArztAKfJBwPfOl78c2/r1r8esIkZSMhme537g sw6HQ4O5jbG0pLR5LDnuzCRAm4rfVb0HxaJ+UFwFvW3+nEaNPiF7KFyUcgn5ofGCogUACXSOrhXB yprVvSxUiFUnXnOnjpa/Duv1ehNWXl5mblu7dm3HyMiITwjRHolE4tNtFxwZGY03NDQUDaxuGoWc s2rge4rRKxVYM01/MOl8R/+8XwpyC4F93/rBr90/PPI2tm9/YMaMDAXadJEnt08a1mrAW3CD/yR+ l6u2Nz8APL+wVlPemsMgzsHg9dLYJlhEtGD0QkkFbq3/uzk912pi1YlXSunMNyhZJJPJkKqq7Q6H I2T2nqFIJKKR4fwQLlyh0CgvdWUB4q+8NuouOue9LEDvOEDDas5Q0oI3pcH3TEDZLHWAMnOdL/z+ +xF76Qpe/vU1D6YPBDC1TuaTDHLnHx86dTToqt4Tx9Q4WQZC7EPeji15z5hTuVRueFZl42CwCmBd 2giDs04C6yWwQRY32DF6iUTwlr2r25I8G1aVeE2DlAeApuu6M3+91Ny2lxMlMpVKdaiq2lqovAUz LuUfi0QiHjOsjufQf/mhM3ryJfzWns2TBVJkDInfduBXw6NYq0rcWpH14zcdGwruzDF568IEro6m IWa5KSIbAmIM9hQ6N3TqaMjt9vSMTUwEYMS/1ibPyilbFGmNdMqGEWCEMtEyuGIW1vScl2iLdq6s GoOV6dw/CMBHRPGSkhJfoXLZ8ZwBQ9AAEoqi+AtZo4l5yrFoNBogIh0ApJQtGzc5OwdfumII1vL3 /dka/OSnF/HK8Ch+cT6Bly5dBWAablzjhmPDNG6EV0fS+L/+7hW8dWG89/TpgZ55vJI4Ee0sdjIW CyeMLYRHKwE0m5E62gpmfyBobA2FK3huwmX0EoR3695veW5Z5eu2c2XV9LyKorjNjPfuwcFB51yi ZzDzJSFEqxDiYH9/f1O2wJnIiazfqjmnbmdmb0NDQxgA3vzKV2L/26MfblV+ljtsXqsar//3d9wB vjMFuXW0+Bwwi7cuTOAL3zyDNy+Mx8ZHCvwRMqYFOdZml6tWS6fTTkVRnJl2A5rLVeuZKX3K0Kmj ISx2cAO7p10wq0a8AJzMhsrmGvZm7dq17pqamkQkEukA0A7Am1OAMGz9k5nbiShkCRcAVKKu2ylv vutgNN6/AXxHCunN06e1zMYS7lvnxw6Nj5YGCu0GYoYTBPeOqrpuInLDHPY6FJHIG+KfhRC6y1Xr XUj+I0G8jWcbiJQ4RKwcskW7cG568fb397ullM6ZyjFzAoAWjUYDsw2ibmGJPZVKBVVVHY5EItMF q3NLmbtLh4Q4DGYPHAx+Xwp8R2p6o00Bro6k8c9H3sY/P/MOrl5NtQ0NDQSzz5tDeqfX642TIA8x xyHQC6Ec4mQy9hd/8ae+TZucofx5u6uqLsQkfFhIhoKkAJ1zGEapO6Y6WBCQkEDnyFrRYS/5LB43 vXhh5M7VZipEtPAQ1eZyUpvZm4WLleO8eXDyNy9DSRvmhbkIFgBiL11BZDCB/3nsAq6OWMKQofxy qqp2WzGnh345NeLk+953y34zpWlOAnECYkSYe4a+bE6VVIo3jH23cv2IYVUGzPks91xdp4Rs0S4+ N7146+vrKxdey+yZqddm5k4hRKuu62Gv15t4N/K5VgYF59PLRgcTePn1kZxzREhIY0thR959Kzkr /Gs+iqI0Syn1/v7+1vr6+szIIEUUVoypwPxRs/7t4HnNZ83A9x4iSiwkBO9q4qYX73IjlUp1lJSU OG91DLnfiXy+NT+DQDGujqTxyusj6HrqDQy+dKVgGSO0KznJiP/ckX2OiIatOX0h6urq4gMDA14p pR6NRv3MfJiZYxcuXNS++md/CZerVptv5gZZNRrAWg5gAuGrt1BHZU1nYi7XR6PRgJmd8RIRbYhG o4lkMun1er3zas9qwRbvIvNHf/RVJ4h2/n8duw6gwrDsTkfhYbEBERLMhmcWMzrPnB7oMHMiHdQ0 jzPPWOXEDM4i5vp1ZX9/vx+AD4B7y5ZNqKgoT4xcHdcwj/ViAHjf3r/pwRwieGRjRtH0Zyc3j0Qi QVVVdV3Xa6w5en9/v3tiYiJebK19NWKLd9ERnlu3lHjWVRQPCXN1JI3/OXAB0djFaXtZYsRB1A2Y 8Zdh7Nmtqt5jxavqybpEI6LEbFqYH9faVb0nDjGLhNaLjCVcIYS3vr4+bh1vbGwMRqPRg4qieKLR qMbMrczsVFUV/f39wexh/2rGFu9iI6Ddurm04KnYS1fQ9dQbePn10Sm9bD5ElCgtKQmPTUzEAWgS 3JF1+pAEeWCKV9d1DYAzlUrF5tVm4mHw9c85Z85r/ebzxZg5SETNRTIxHhZCtMP4o9TS0NDQMTAw oKXT6cFIJNJrz4tt8S4+UoZOvnTl4J/9/SvO37hrTeLKtTRee3vMOfjS1RkFmwNz69jYWHho6FjG IKdpHmdZ2ZgTzGEy8uAGAEBRFA+A2HIeUuq67nY4HDqM7IwgonZm7m1oaAhNc5kGoMUyEtbV1cWj 0WiMrbSpq5xV4x55oxgaOhZnKWv6BhOd/8//OIfv//QtZySWmJtwASufr54dzqa8YiIIIj1leFBp 1jkhhJWDeF4QT+4uuh7ouq6Zwu00E7p5AMSIqGf6V0DxItZ953wCJ6w0bPEuBoyc5aqhoWNxYtmx 4HqJtOxwNqUlJUFyOFpeNgOml5WNOc0h836Hw1HwfrquW2WmaT42Qor49Xo9qqrqQoie7G2YzNxr Busr3CbmEPLWpE0uCSHaVVW92NfX58MqxhbvwokXOkhEPp5reJhC9RieYQCMzQKnX4j0mLmGAACK ogSZudeaN+b3SCUlJUFVVYcHBgamc8TYNl2StIXQ39/fSkQQQuQYmRobGwNF5rrW+XD+JhEAkFKG FEWpNNfTD16PNt8s2HPeRYAIG/KPMRYnLGmhqJRjYxM+CI7//d9/DUKIA4qiVAKZnVN6X19fixmo HfX19YFoNBpPp9MhXdd789dOZ5skbS709fWFFEXZYHqaaUII73RCnQvWc0WjUSYira+vz7/QOoko fjMawGzxLgIFe9giG/7nSn4OoQ9+sM5HAu0MblFVVSeikCUMVVW7iChs/cAtGhoaOqLR6H5VVX3I c+5wMGsgimERURSlQ0rpI6JERUVFaDHyH+dDRCSlPEtE/kWoLoyF+HYvEbZ4F4qQccjc2Yeu687+ /l9o/+8//o8FVW3lEDKtzAdJiAAIkJLb/uF739wGABUVFS1Zl3iklN4i1Z0tZKVlw1kjtpivxBzu LmqdBe4RuJ713wysuDmvmQpTv1HGjLQUCWRFmtB13a2q6qDHU3vgsY89sqC6GYi5XLVaWfnEIITw shBNp395dOM/fO8bG2A6N+T1aolpqttWOPwP7aMi2Qdtljcrquc1hdNNRLF169aFb8Q9FSkTEAJZ uXPd1rnHHvsIAODJHz89v8qlOATiIBHHTp8aaNJ13amqajsAX5F5ZIyI9iNvCGhamz2KouREfnTd W+uBhDY6UnpD3pXN4rJixGutJTJzZ0NDQ/BG3besrCwxNjGBn5842fnArp1TYhs/9thHsGPH3fiH 0D/hwoWLs653y+aNuHrlWmxsQh5gKSstYxQRJYoZgBRFaU6n04PRaNRJRJ0TExNxh8PhNkPddk65 Jk1+EEILTu9psySsiGGz2SNZTgDB2VzT19fni0QinoXe2wyZCrBwFyuzY8fd+MuvfRXN/t/D+++8 bcY6KyrK0Oz/PYylxtyAsW5cUlLiZOZD9fX1NcUst3V1dXFFUWoAEDMPqqp6kYi6mflQY2NjILus y1WrgegApDg0U3tslicrouctKSk5CADFelwzkuNBIUTLYi1ZuFy1HibhE4QDICTefPPtBPChaa+p 33M/6vfcj/Pn38OZl17Fr3/9Bn796zcy57ds2YTNm5yor78fmzdvipc5ymLjExOHgdkbgczn8wPw DwwMaEWflygIRu/QUDS8iF+FzQ3k+nujX2fM4eQwM3vz1+p0XXc6HI4uIvIw86x75WJkC7a8osw5 cm30EBQlNHbVEYvHw4lIJBI0YzwvBrGGhoaahVdT8Dk0CDEMKby2eG9eVkLPmyCi5uyAb8CkwwIz n1UUpWa+PW519QNuKZX9EMIPQCOgl4GWJx7/avuaNRXD9fX1mfs2NjYG+/r64kKIrvncKxtmvrTQ OopC1AUgZAv35uamF6+5kyaUfcwSrpSyd+/evf651mmtq4LII0EeCPQScefotdKMcWfdurVhKyoF gDAznxVCbJNS+pi5l4gYRoD3+RK7Hu/LVV1rZEKQsnnBldksKTe9eAthLRfNRbia5nGWl4/7GdgP mvAAopeIe0avlTQVssZaUSn6+vp85pY8DcY6ayYihBmxonU+W9iEELHFfi/V1Q+4JURQMje9NM+Q NzbLh5t+zptPX1+fX1GU1tn402qax0hCzXwARB42MsUfhpSh+cZzKkR/f79fSuk3ozfOCBHF6uvr F3W+a1iXhQ7GoaGho8HFrNtmaVhxPa8QohVAWzHhmkNiN4haiSbc5RVlzuqqD/Y+N/ii98yL12cO aIWdGRgY0KSUHmb2MLNmphtxWuWY+SyA0Jo1azpmW7dlSWdmN2AIP51OH85OS2oLd2Wyonpeq9ct FA7W5arVmETAXNqBlDhEiuj57t9/zUdEWkNDg2+p2j0wMKCVlZUl5urAH41GuwD4mLmTmWNElCAi PxHtk1I2NzY2hqurH3BLVrtt4a48VlTPK4TwSSmn+Om6XLUaCTEIoIeFaBrK7WF9S93u+VjCo9Fo OxF5hBD5lvSwlYupqqouwKBWMDpt4a48VpR4mTnmcDhCU04I4ZfMvWdOD0yxsBLRTiK6qbyMTF/l gBCispDwm5paUFVd1w0iD6dlS34ybJuVwYoS73ROGEQ0xbHYctgXQtyQZRMreqKiKDullGcBhOez CdzhcPizo2dYTG4dnAgw6CTSsmYxDW82y4sVJd5iEHMiP3OB5Q9d0GH/OpCVFeAkM8fNfEcHo9Fo TzKZbJlL5Eci0pg5bH3OE22iwNTghqDrurOsrMx5I96nzQozWBWjqqrOx0TtZqJoy4mjm4gwmyWZ aDQagJFixGMeCieTyebZpuPo7+9vZeZAdlYAwDBUpdPpbiKKm1kM/TC29cXT6XQvEcUK9czt7X/r 7u0dcJ458yu3sS5NHgC9gAwVTH59A4hGo5lQtADiUsqW/IgeNovLqhCv5cv7ve/8VQtMERJRT0VF RfN0Fl5T5F1mT9epKEqPlNLJzAEA+5PJZM1MArZ8r4moplBANSuQOAqE0mn78w5MjE/E33773Thg JMQmo5wGACA6CeYeCBFeip7WwjSe+QA01dfXx8w/du2F/M1tFo9VIV4AqKrec/Fg4FO991Z/MMzM sdn8qKLRqE5EzoqKivyIFYhGozoz98602cEMxsb19fXN090HBVwpz5z5Fc5fuIjR0VGUl5cDAH7w T0/i2rWxzvHRkuBy2Idr/XFSFCXHeGZu0tjX0NDgXUD1NtOwKua8AMDEsfb274bPnB7omE35vr4+ PxFpBULNWBwmY7g6LUKIbel0eiZrdsFNCDt23I0dWZ9HRkbRFfonEMuO5SBcoLjxLJVKdaiqetB0 H93JzH4Y7qPhhoaGlnncyiaPVSNeMPUSeEpqzGIIIQ5IKQ9nJ8DKRkqZEELsnEVVl6ZL/m1avGdT Dyoqym/wS5sdQojh/GNmIvKYEKJbStnLzC1mFJCuaDQKZj4shDgAwJnvEWYzO1ZEJI3ZPakMM5E7 O33IdDBzJaZPW5nADCk1TcJEVDQ4uKqqrZhDcPbNmzfCtFQvKdFotD0SiVwkoqIbL5j5pBkT2bN3 794ec6rSBCBARvbDS1LKk4qitJoGL5s5sGrEO/TisTARx0rLx/2zKU9EG2Yo4qNZxDtOJpMhAL19 fX3+7LQjkUjEY86pPWbomsRs2vWB998OiRufjjMbc0rhA9BERDXMXDDlZmNjY6CioiLHmi+ESACA oig19fX1gcbGxqAQwktEPjPlp80sWTXiBQCSOGxmlZ8NsWI9nLkZ4EB+Co9CeL3eRENDg4+I3Kqq Dkej0WGzx+pm5t6Kioqaurq6ODN3zqZRZs87q2H29UIIccCMTBKur6+f1viXby8w42zlGLfMfzcx c8AW8OxZNdZmAHC7Pc7xiYlhlrJpaOhYeLqy1maBkZERzVriMR07WmGsZ7YUyWA3bZ2pVEoTQiQq Kiri2T9ss+5hzDCEfvqZCH7wg6dip08dXdCWQTPapn8+1xLRATOoXXAhbcinv7/fDaDb3HFVcGnN ZpLVY7CCEenRVb2nE0acqfB0Za2eob+/vzsajcbNwx4zlea81i/NOuOFznm93kQkEumcKQbW5k0b sRgJzADDU2uel55cwLVFMcVaOW3gPJsMq6rnBSZ73zRz80unB3pmKm86UfgAY+PD9XQ6mE3ve/7C RXzlq1/D0Kmjq+67s8llVf4AdlTVBQg4ODZaWrNc1kstZopAOTIyii8EWgEpK+1NB6ubVWWwsjhz eqADAvHy8vFlZxwx55GxYucrKspRUVEGwKEtdVttlpZVKV4AQJqbQeR3uWoPLLyyxUVKOa0Vu7y8 HBBSW+p22iwtq1a8Q0PH4mBuZiE6tm9/wH0j7hmJRDrMDIb+6cqZbpcxFFn73bJlI8zE1TarmFUr XsAwQAkAQlV1l6tWW8y6dV13RqPRwUgkEsw63APgsOlRNKjrurPQtUTkJKIYEXkLpeXcvHkTiKjg tTarh1UtXhAFGTC22REtqoDNNCtYu3Zth3WssbEx3NDQ0CGE8JplAkUujzGzb2JiIm6WLbSxYdtS vz6bpWXVijeTJc+CSAORvn37A+6+vj6fub6rR6PRrrkm6u7r6/MJIdxCiKZCO5JMj6oWIjpYqPc1 XSrjZtYHZ0NDg19RlEoi6mTmXuU6BGS3uflYteItqdgUmHKQSFNUdfDv/u7QfmbulVIeAkCKorRH o9GuYsPcqdWQh5lPTudoYK4XO8vKyqbU6fV6E4qiNMEImTMYjUaH0+l0F4ANQohAJPrsYTAqYbOq WVUeVtlMjF/cWWyZO/b8af+nPvN/hiBl29DQMStYum5mpZ8xWJ05T53W/7i/v9/NzBgbG0sUOm+l 6hwcHAxcuXLFI4TQpJROh8ORQBEvLZvVxap00gCMyBozuhkyx1nKzjNnjneYnlbDswntouu6s6Sk ZJCZe5LJZGehUDl9fX0hIYRzPsHeXdV7/AQcXKh/s83NzaocNrvdHues/IOJNFKUdldV3XBzc4vn 2rVrsdnspfV6vQlrm5uqqnp/f3+r6XSPgYEBLRqNtgsh9iuKEpjvMyyWf7PNzcuq7HkzyaXnSEVF GW6//dbYKy+92jRb18RCScaYudfhcPjn63zvurfWAym6rGiYNquT1Sle48evL6gSKf1DQ8fmlGlh vjmJirR/VuKNRCKeVCoVm0tcaJubg1U5bF4UhAi5XLWeuVxSV1cXX6hw5woR+UtKSrQbeU+bG8Pq tDanEF+MP1ssRLfLVbtsUoqYYXYS2b1sQ0ODf6nbZXN9sHveBWB5Zs02qN31RlXVjmm8tmxWGLZ4 FwqRVloxcUMEbAWt+0P/J4pFowxnG8ZsVjarctjs+Wg7Xn31X/HaKz9dlPoIcJeVjw+6XLXe/CG0 ueZ70Aw6rpmHYwBiyWSybY75joLM3PbCyVNxAO4p7SAKm8nMbFYBq7Ln/XZHXXzb9o/iLpdv8So1 faOzjVgDAwMHHA7HsJTSK6VsI6IaIqox9+uSqqrDs4mWaJbxE1FNY2Nj8OeDsXihchMTE3EAzoGB AS37eCQS6bDWmW1WDquy57W4o3IfNt/6ITx//G8xPvrewiu0BFy9J1T74G90ptPpEBEVijIZA9DT 19fXY2YQuFQsEqWu65rZ43obGxtjAEBpcnKBRT4zS0GhanzpdDqGaSJ02Nx8rMqeN5uy8k140PPv 8YF7fhMOx6KlE/EfO/5i91f/3demDQ+7d+/eHmZuAtCaHZA9G0VRgkQUynbJNLMFJorVm0qlNNis eFa9eC22bf8oahq+hK13PLA4FRJp775zsd1VVTfsqt7TVWyvsCnKWDErsRBiXzqdPpx3WGMunJwM ABwOR/zGv0GbG40t3izKyjdhx32fwAOef4+tdzyA0vJNC6/UiG/shxDDO6r3DFZV1QXynTuYuY2y 9xbnoimKEs980DxOMA6AZCi/oLVlsdhOJZuVxaqc8/oDg05gouh5S8Sp1CguvPUC3j73LC6996sF 35cANxO5QYSq6j0JZo4x6ORXv/qXieY//D3n9u0PuJPJNfHscLTMfDKZTMYBwyebaaIbxBg6dSyU X7/D4XAjz0kji0LHbG5iVqVv86cDz7qh8OBcrhkbfQ8X3noBF955YVGEPBMEJHiq4DQAvWMjJb5C 8abNmM/u/G2Gg4ODzhvtlmlz/VmVPa9UWJvrfKGsfBPuqNyHOyr3IZUaxdVL53DpvVdw6b1XcO3y G0ilRhe1jcaWP05AKM2QUoMQ8bGrjth0QeKJaD8RTUlYZgt3ZbIqxUss3aD5T/cdjnI4N98D5+Z7 MscsQY+Nvodx878xc/kplRydlbjLyjehrHwTFLUcZWWb8NorP9VSE9cwNDR1iJyPaa12CyHCS/1+ bW4Mq1O818GF0BL0YjI2+h7eiPfOmBTNuL9DA9BiJ+haPay6Oa8/MKCpytw34i8FVy+fw2D/NzA2 UrJxueVUsll6Vt1SkYNEcKnbMFvWrr8DGzbdg7KyicBSt8Vm+bGqxOsPDGgksOxyE03H5q33AsT2 TiGbKawq8apigaFvloD33fkgQORZ7HQsNjc/q0q8gGwDo3epWzEXHGo5Nmy6B0zkW+q22CwvVp3B CgACgUHnVceYm9LkA5EbhGU9LD378k/w2ss/CQ+dHvAudVtslg+rUrz5WGKGZDcgPATSQNNnPLiR XHrvFZw8/reJM6eOblzqttgsH2zxFiFb0MRCY4JminobbnDA81RyFD8P/znGRy/XvPzyz2NL/W5s lger0kljNnR01CRgOEeEC53/bGBASzmMsDZSQhNgJ5CXM5czYW8AAARKMHEivy6Zl3tIiMnPjhTi iihFKj3SZTpixJb63djY2MyB5RKh0sbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbG xsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbG xsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGZirKUjfAZhK3x6fdqrnw VnxozPzsvFVzlVmfVyvme3G+FR9KLHVblhNiqRtQCPdDHw/UPLx/2P3QxwOFztc8vH+45uH9+lK3 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 NTErMDI6MDAKfsOXAAAAAElFTkSuQmCC"
              />
            </svg>
          </div>
        </div>
      )
    }

    return (
      <Fragment>
        {requestJoins.map((item, index) => {
          return (
            <Card
              key={`request-to-join-item-${index}`}
              className="request-to-join-item mb-75">
              <CardBody>
                <div className="w-100 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="me-1">
                      <Avatar src={item.avatar} imgWidth={60} imgHeight={60} />
                    </div>
                    <div>
                      <p className="mb-0 full-name">{item.full_name}</p>
                      <small className="requested-time">
                        {useFormatMessage(
                          "modules.workspace.text.requested_on",
                          {
                            date: moment(item.requested_at).format(
                              "dddd, DD MMM Y"
                            )
                          }
                        )}
                      </small>
                    </div>
                  </div>
                  <div className="button-section">
                    <Fragment>{renderAction(index, item)}</Fragment>
                  </div>
                </div>
              </CardBody>
            </Card>
          )
        })}
      </Fragment>
    )
  }

  return (
    <div className="pt-25 request-to-join-body">
      <Fragment>{renderComponent()}</Fragment>
    </div>
  )
}

export default RequestToJoinBody
