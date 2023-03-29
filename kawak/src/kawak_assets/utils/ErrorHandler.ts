import toast from "react-hot-toast";
const ErrorHandler = (err: any) => {
	const newArray = [];
	const errMsg = err.message.split(" ");
	const starter = errMsg.indexOf("$");
	const ender = errMsg.indexOf("#");
	for (let i = starter + 1; i < ender; i++) {
		newArray.push(errMsg[i]);
	}
	const returnedError = newArray.join(" ");
	console.log(returnedError);
	toast.error(returnedError);
	return;
};

export default ErrorHandler;
