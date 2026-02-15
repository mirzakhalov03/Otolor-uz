import { CONTACT } from '../../constants';

/**
 * Call Button Component
 * CTA button for phone contact
 */
const CallButton = () => {
  return (
    <div>
      <button className="w-full h-full border-2 border-[#02c539] py-2 px-4 rounded-xl transition-colors hover:bg-[#02c539]/10">
        <a href={`tel:${CONTACT.PHONE}`} className="text-[#02c539] font-medium">
          {CONTACT.PHONE_DISPLAY}
        </a>
      </button>
    </div>
  );
};

export default CallButton;