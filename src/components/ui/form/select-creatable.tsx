import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import Select, { ActionMeta, OnChangeValue } from 'react-select';

interface Option {
  readonly label: string;
  readonly value: string;
}
const createOption = (label: string) => ({
  label,
  value: label.toLowerCase().replace(/\W/g, ''),
});

const defaultOptions = [
  createOption('123'),
  createOption('456'),
  createOption('789'),
];
type Props = {
  options: any,
  zipcode: any,
  newZipcode: any,
  setZipcode: any
  setNewZipcode: any
  setOptions: any
  setIsCreated: any
}

export default function SelectCreatable(props: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleChange = (
    newValue: OnChangeValue<Option, false>,
    actionMeta: ActionMeta<Option>
  ) => {
    console.group('Value Changed');
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    props.setZipcode(newValue)
  };
  const handleCreate = (inputValue: string) => {
    setIsLoading(true)
    console.group('Option created');
    console.log('Wait a moment...');
    setTimeout(() => {
      const newOption = createOption(inputValue);
      props.setIsCreated(true)
      props.setNewZipcode(newOption)
      console.log(newOption);
      console.groupEnd();
      setIsLoading(false)
      props.setOptions([...props.options, newOption])
      props.setZipcode(newOption)
    }, 1000);
  };
  return (
    <CreatableSelect
      isClearable
      isDisabled={isLoading}
      isLoading={isLoading}
      onChange={handleChange}
      onCreateOption={handleCreate}
      options={props.options}
      value={props.zipcode}
    />
  );
}