import { useEffect, useState } from "react";


function checkValidation(value, validations) {

    const { required, length, pattern } = validations;

    if (required) {
        const requiredMessage = required.message;
        if (value === "") {
            return {
                isError: true,
                message: requiredMessage
            }
        }
    }

    if (pattern) {
        const { regex, message } = pattern;
        if (!regex.test(value)) {
            return {
                isError: true,
                message
            }
        }
    }

    return {
        isError: false,
        message: null
    }
}


const useForm = () => {

    const fields = [];
    const initailData = {}
    const [data, setData] = useState(initailData);
    const [errors, setErrors] = useState({});

    function setModelValid() {
        const errorArray = [];

        if (fields && fields.length === 0) return;

        fields.forEach(field => {
            const currentfield = { ...field };
            const fieldIndex = errorArray.findIndex(f => f === currentfield.name);
            const errorFieldKey = errors.hasOwnProperty(currentfield.name);
            const errorFieldValue = errors.hasOwnProperty(currentfield.name);
            const { isError, message } = checkValidation(currentfield.value, currentfield.validations);

            if (isError) {

                if (!errorFieldKey || errorFieldValue !== message) {
                    const currentError = { [currentfield.name]: message };
                    const updatedError = Object.assign(errors, currentError);
                    setErrors(updatedError);
                }

                fieldIndex < 0 && errorArray.push(currentfield.name);
            } else {
                if (errorFieldKey) {
                    const errorsClone = { ...errors };
                    delete errorsClone[currentfield.name];
                    setErrors(errorsClone);
                }
                fieldIndex >= 0 && errorArray.splice(fieldIndex, 1);
            }

        });

        return errorArray.length === 0;
    }

    function handleSubmit(onSubmit, e) {

        e.preventDefault();
        const modelIsValid = setModelValid();

        if (modelIsValid) {
            onSubmit(data);
        } else {
            const dataClone = { ...data };
            setData(dataClone);
        }
    }


    function handleOnChange(event) {

        const target = event.target;
        const name = target.name;

        const dataClone = { ...data };
        dataClone[name] = target.value;


        const fieldIndex = fields.findIndex(f => f.name === name);
        const field = fields[fieldIndex];
        const fieldClone = { ...field };
        fieldClone.value = target.value;

        fields[fieldIndex] = fieldClone;
        setModelValid();
        setData(dataClone);
    }

    function register(props, elem) {

        if (!elem) return;

        const key = elem.name;

        if (key) {
            initailData[key] = elem.value;
            fields.push(
                {
                    name: elem.name,
                    min: elem.min,
                    max: elem.max,
                    validations: props.validations,
                    type: elem.type,
                    value: elem.value || elem.defaultValue,
                    key: elem.name
                }
            )
        }
    }

    return {
        register,
        errors,
        handleOnChange,
        handleSubmit,
    }
}

export { useForm };