import CheckBox from '@/base-ui/utils/CheckBox';
import useCheckBoxStore from '@/stores/useCheckBoxStore';

export default function TotalCheckBox() {
  const checkBoxEntry = useCheckBoxStore((state) => state.checkBoxEntry);
  const allToggleIssue = useCheckBoxStore((state) => state.allToggleIssue);

  const headerBoxStatus = Object.values(checkBoxEntry).some((status) => status === true);
  return (
    <CheckBox
      isDisabled={true}
      isActive={headerBoxStatus}
      onClick={() => allToggleIssue(headerBoxStatus)}
    />
  );
}
