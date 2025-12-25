import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const PhoneField: React.FC<Props> = ({ value, onChange }) => {
  return (
    <PhoneInput
      country="et"
      value={value}
      onChange={onChange}
      inputProps={{
        name: 'phone',
        required: false,
        autoFocus: false,
      }}
      specialLabel="Phone"
    />
  );
};

export default PhoneField;
