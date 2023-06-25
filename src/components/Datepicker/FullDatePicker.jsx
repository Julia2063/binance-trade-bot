import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";

import './FullDatePicker.scss';
import { getMonth, getYear } from "date-fns";
import range from "lodash/range";

import { FaAngleDown } from "react-icons/fa";
import { useOnClickOutside } from "../../helpers/hooks/useOnClickOutside";


import Input from "../Input/Input";
import CustomButton from "../CustomButton/CustomButton";


function FullDatePicker({ setStart, setEnd, handleModal }) { 
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  

  const [selectYearStartIsOpen, setSelectYearStartIsOpen] = useState(false);
  const [selectMonthStartIsOpen, setSelectMonthStartIsOpen] = useState(false);
  const [selectYearEndIsOpen, setSelectYearEndIsOpen] = useState(false);
  const [selectMonthEndIsOpen, setSelectMonthEndIsOpen] = useState(false);
  

  const [isEndDateChanged, setIsEndDateChanged] = useState(false);

  const selectValues = ['Choose -', 'Today', '3 Days', '7 Days', 'All'];

  const [period, setPeriod] = useState(selectValues[0]);

  const selectMonthStartRef = useRef();
  const selectYearStartRef = useRef();
  const selectMonthEndRef = useRef();
  const selectYearEndRef = useRef();

  const onChangeRange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  useOnClickOutside(selectMonthStartRef, () => setSelectMonthStartIsOpen(false));
  useOnClickOutside(selectYearStartRef, () => setSelectYearStartIsOpen(false));
  useOnClickOutside(selectMonthEndRef, () => setSelectMonthEndIsOpen(false));
  useOnClickOutside(selectYearEndRef, () => setSelectYearEndIsOpen(false));
  
  const yearsStart = range(2020, getYear(new Date()) + 1, 1);
  const yearsEnd = range(getYear(new Date()), 2029);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  

  useEffect(() => {
    if(endDate <= new Date(startDate?.getFullYear(), startDate?.getMonth(), 31||30||29||28)) {
      setIsEndDateChanged(true);
    } else {
      setIsEndDateChanged(false);
    }
    if(!endDate) {
      setIsEndDateChanged(false);
    }
  }, [endDate]);

  useEffect(() => {
    switch(period){
      case 'Today':
        setStartDate(new Date());
        setEndDate(new Date());
        break;
      case '3 Days':
        setStartDate(new Date(new Date().setDate(new Date().getDate() - 2)));
        setEndDate(new Date());
        break;

      case '7 Days':
        setStartDate(new Date(new Date().setDate(new Date().getDate() - 6)));
        setEndDate(new Date());
        break;

      case 'All':
        setStartDate(null);
        setEndDate(null);
        break;

      default: 
        break;
    }
  }, [period]);

  const handleSetDate = () => {
    setStart(startDate);
    setEnd(endDate);
    handleModal();
  };

  console.log(startDate, endDate);

  console.log(isEndDateChanged);

  return (
    <>
    <div className="datepicker">
      <div className="datepicker__item">
        <DatePicker
          selected={startDate}
          onChange={!isEndDateChanged ? onChangeRange : (date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          selectsRange={!isEndDateChanged}
          disabledKeyboardNavigation

          renderCustomHeader={({
            date, changeYear, changeMonth,
          }) => (
            <div
              style={{
                width: '100%',
                display: "flex",
                gap: '30px',
                padding: '0 15px 15px 15px',
              }}
            >

              <button
                className="react-datepicker__header__select"
                onClick={() => setSelectMonthStartIsOpen(!selectMonthStartIsOpen)}
                ref={selectMonthStartRef}
              >
                {months[getMonth(date)]}
                <FaAngleDown />
                {selectMonthStartIsOpen &&
                  <div
                    className="react-datepicker__header__select__values"
                  >
                    {months.map((option) => (
                      <div
                        className="react-datepicker__header__select__values__item"
                        key={option}
                        onClick={() => {
                          changeMonth(months.indexOf(option));
                        } }
                      >
                        {option}
                      </div>
                    ))}
                  </div>}
              </button>

              <button
                className="react-datepicker__header__select"
                onClick={() => setSelectYearStartIsOpen(!selectYearStartIsOpen)}
                ref={selectYearStartRef}

              >
                {getYear(date)}
                <FaAngleDown />
                {selectYearStartIsOpen &&
                  <div className="react-datepicker__header__select__values">
                    {yearsStart.map((option) => (
                      <div
                        className="react-datepicker__header__select__values__item"
                        key={option}
                        onClick={() => changeYear(option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>}
              </button>

            </div>
          )}
          inline />
        <DatePicker
          selected={isEndDateChanged ? '' : endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          disabledKeyboardNavigation
          startDate={isEndDateChanged ? null : startDate ? startDate : new Date().setMonth(new Date().getMonth() + 1)}
          endDate={isEndDateChanged ? null : endDate}
          maxDate={startDate ? null : new Date().setMonth(new Date().getMonth() + 1)}
          minDate={startDate ? startDate : new Date().setMonth(new Date().getMonth() + 1)}
          excludeDates={startDate ? [] : [new Date().setMonth(new Date().getMonth() + 1)]}
          renderCustomHeader={({
            date, changeYear, changeMonth,
          }) => (
            <div
              style={{
                width: '100%',
                display: "flex",
                gap: '30px',
                padding: '0 15px 15px 15px',
              }}
            >

              <button
                className="react-datepicker__header__select"
                onClick={() => setSelectMonthEndIsOpen(!selectMonthEndIsOpen)}
                ref={selectMonthEndRef}
              >
                {months[getMonth(date)]}
                <FaAngleDown />
                {selectMonthEndIsOpen &&
                  <div className="react-datepicker__header__select__values">
                    {months.map((option) => (
                      <div
                        className="react-datepicker__header__select__values__item"
                        key={option}
                        onClick={() => {
                          changeMonth(months.indexOf(option));
                        } }
                      >
                        {option}
                      </div>
                    ))}
                  </div>}
              </button>

              <button
                className="react-datepicker__header__select"
                onClick={() => setSelectYearEndIsOpen(!selectYearEndIsOpen)}
                ref={selectYearEndRef}
              >
                {getYear(date)}
                <FaAngleDown />
                {selectYearEndIsOpen &&
                  <div className="react-datepicker__header__select__values">
                    {yearsEnd.map((option) => (
                      <div
                        className="react-datepicker__header__select__values__item"
                        key={option}
                        onClick={() => {
                          changeYear(option);
                        } }
                      >
                        {option}
                      </div>
                    ))}
                  </div>}
              </button>

            </div>
          )}
          inline />
      </div>

      <div className="datepicker__item2">
        <p className="datepicker__item2__title">Period</p>

        <Input
          selectValues={selectValues}
          value={period}
          setValue={setPeriod}
          className={'input--dark'} />


      </div>

    </div>
    <div className="datepicker__setDate">
      <CustomButton
        title='Apply'
        customClass="datepicker__setDate__button"
        handleClick={handleSetDate}
      />
    </div>
    
    </>
  ); 
}

export default  FullDatePicker;