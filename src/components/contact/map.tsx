import Map from '@components/ui/map';

const ContactMap = () => {
  return (
    <Map
      lat={13.7511592}
      lng={100.571878}
      height={'420px'}
      zoom={19}
      showInfoWindow={true}
    />
  );
};

export default ContactMap;
