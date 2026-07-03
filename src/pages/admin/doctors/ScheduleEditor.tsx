import { Checkbox, TimePicker, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import type { ScheduleDay } from './useDoctorSchedule';

const { Text } = Typography;

interface Props {
  days: ScheduleDay[];
  enabledDates: Set<string>;
  dateTimeRanges: Record<string, [dayjs.Dayjs, dayjs.Dayjs] | null>;
  onToggle: (dateStr: string) => void;
  onRangeChange: (dateStr: string, range: [dayjs.Dayjs, dayjs.Dayjs] | null) => void;
}

/** Next-7-days availability editor: a checkbox + time-range picker per day. */
const ScheduleEditor = ({ days, enabledDates, dateTimeRanges, onToggle, onRangeChange }: Props) => {
  const { t } = useTranslation();

  return (
    <div style={{ marginBottom: 24 }}>
      <Text strong style={{ display: 'block', marginBottom: 12, fontSize: 14 }}>
        {t('adminDoctors.form.availabilityTitle')}
      </Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 16, fontSize: 12 }}>
        {t('adminDoctors.form.availabilityHint')}
      </Text>
      <div className="schedule-grid">
        {days.map((day) => {
          const isEnabled = enabledDates.has(day.dateStr);
          const timeRange = dateTimeRanges[day.dateStr];
          return (
            <div
              key={day.dateStr}
              className={`schedule-row ${isEnabled ? 'schedule-row--active' : ''} ${day.isSunday ? 'schedule-row--sunday' : ''}`}
            >
              <Checkbox
                checked={isEnabled}
                onChange={() => onToggle(day.dateStr)}
                className="schedule-row__checkbox"
              >
                <div className="schedule-row__label">
                  <span className="schedule-row__day">{t(`adminDoctors.days.${day.dayIndex}`)}</span>
                  <span className="schedule-row__date">{dayjs(day.dateStr).format('MMM DD, YYYY')}</span>
                </div>
              </Checkbox>
              <div className="schedule-row__time">
                {isEnabled && (
                  <TimePicker.RangePicker
                    format="HH:mm"
                    minuteStep={30}
                    placeholder={[t('adminDoctors.form.timeStart'), t('adminDoctors.form.timeEnd')]}
                    value={timeRange}
                    onChange={(val) => onRangeChange(day.dateStr, val as [dayjs.Dayjs, dayjs.Dayjs] | null)}
                    size="small"
                    style={{ width: 200 }}
                  />
                )}
                {!isEnabled && (
                  <Tag color="default" style={{ fontSize: 12 }}>{t('adminDoctors.form.dayOff')}</Tag>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleEditor;
