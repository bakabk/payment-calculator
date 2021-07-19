import * as React from 'react';
import {
    Formik,
    Form,
    useField
} from 'formik';
import * as Yup from 'yup';

import { useAppDispatch } from '../../app/hooks';
import {addData, IMetersData} from '../rentData/rentDataReducerSlice';

import './Add.scss';

const initialValues: IMetersData = {
    id: new Date().getTime(),
    date: new Date(),
    electricityData: 0,
    electricityPrice: 0,
    gasPrice: 150,
    rentPrice: 18000,
    serviceRentPrice: 1416,
    title: '1111',
    waterData: 0,
    waterPrice: 0
};

interface IInputProp {
    name: string,
    placeholder: string,
    title: string
}

const formInputs: Array<IInputProp> = [
    {
        title: 'Описание',
        name: 'title',
        placeholder: 'Title'
    },
    {
        title: 'Показания по воде',
        name: 'waterData',
        placeholder: '0'
    },
    {
        title: 'Стоимость одного куба воды',
        name: 'waterPrice',
        placeholder: '0'
    },
    {
        title: 'Показания за электричество',
        name: 'electricityData',
        placeholder: '0'
    },
    {
        title: 'Стоимость 1кв электричества',
        name: 'electricityPrice',
        placeholder: '0'
    },
    {
        title: 'Стоимость газа',
        name: 'gasPrice',
        placeholder: '150'
    },
    {
        title: 'Стоимость аредны жилья',
        name: 'rentPrice',
        placeholder: '18000'
    },
    {
        title: 'Коммунальные услуги',
        name: 'serviceRentPrice',
        placeholder: '1416'
    },
];

const MyTextInput = ({ title, ...props }: IInputProp): JSX.Element => {
    const [field, meta] = useField(props);
    const hasError = meta.touched && meta.error;
    let classes = 'add-form__input';
    if (hasError) {
        classes += ' add-form__input_error';
    }

    return (
        <div className='add-form__input-wrapper'>
            <label htmlFor={props.name}>{title}</label>
            <input type="text" className={classes} {...field} {...props}/>
            {hasError ? (
                <div className="add-form__input_error-text">{meta.error}</div>
            ) : null}
        </div>
    );
};

const prepareFormInputs = (data: Array<IInputProp>):Array<JSX.Element> => {
    return data.map((inputData: IInputProp, i: number) => (<React.Fragment key={i}>
            <MyTextInput
                title={inputData.title}
                name={inputData.name}
                placeholder={inputData.placeholder}
            />
        </React.Fragment>
))}

const Add: React.FC<{}> = () => {
    const dispatch = useAppDispatch();

    return (
        <div className='add-form'>
            <h1 className='add-form__title'>Форма добавления данных</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={Yup.object({
                    id: Yup.number().required('Required'),
                    date: Yup.date().default(function () {
                        return new Date();
                    }),
                    electricityData: Yup.number().required('Required'),
                    electricityPrice: Yup.number().required('Required'),
                    gasPrice: Yup.number().required('Required'),
                    rentPrice: Yup.number().required('Required'),
                    serviceRentPrice: Yup.number().required('Required'),
                    title: Yup.string().required('Required'),
                    waterData: Yup.number().required('Required'),
                    waterPrice: Yup.number().required('Required')
                })}
                onSubmit={(values, actions) => {
                    console.log('>>>onSubmit', { values, actions });
                    actions.setSubmitting(false);
                    dispatch(addData(values));
                }}
            >
                {formProps => {
                    const isDiasabled = !formProps.isValid;

                    return <Form className="add-form__from">
                        {prepareFormInputs(formInputs)}

                        <button disabled={isDiasabled} className='add-form__submit' type="submit">Submit</button>
                    </Form>
                }}
            </Formik>
        </div>
    );
};

export default Add;