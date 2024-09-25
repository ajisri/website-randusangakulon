// ToastContainer.js
import React from "react";
import { Toast } from "primereact/toast";

class ToastContainer extends React.Component {
  constructor(props) {
    super(props);
    this.toast = React.createRef();
  }

  showToast = (severity, summary, detail) => {
    this.toast.current.show({ severity, summary, detail, life: 3000 });
  };

  render() {
    return <Toast ref={this.toast} />;
  }
}

export default ToastContainer;
