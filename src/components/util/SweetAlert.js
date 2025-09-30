import Swal from "sweetalert2";

const SweetAlert = {
  //Success Alert
  showSuccess: (title, message, onConfirm = () => {}) => {
    return Swal.fire({
      icon: "success",
      title,
      text: message,
      confirmButtonColor: "#3b82f6", // Tailwind blue-500
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonText: "Okay"

    }).then((result) => {
        if(result.isConfirmed) {
            onConfirm();
        }
    });
    
    ;
  },

  //Incorrect information Alert
  showInvalid: (
    title,
    message,
    onConfirm = () => {}
  ) => {
    return Swal.fire({
      icon: "warning",
      title,
      text: message,
      confirmButtonColor: "#f59e0b", // Tailwind amber-500
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm(); // Optional callback
      }
    });
  },

  //Error Alert
  showError: (title, message) => {
    return Swal.fire({
      icon: "error",
      title,
      text: message,
      confirmButtonColor: "#ef4444", // Tailwind red-500
    });
  },

  //Confirmation Alert
  showConfirmation: (
    title,
    message,
    onConfirm = () => {},
    onCancel = () => {}
  ) => {
    return Swal.fire({
      title: title,
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      } else {
        onCancel();
      }
    });
  },
};

export default SweetAlert;
