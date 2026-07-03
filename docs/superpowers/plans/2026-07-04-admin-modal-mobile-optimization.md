# Admin Management Modal Mobile Optimization — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the admin management modals (Doctors, Services, Categories) genuinely mobile-friendly and more intuitive — one shared responsive modal shell, plus a 2-step wizard for the heavy Doctor form.

**Architecture:** A single reusable `ResponsiveFormModal` wraps AntD `<Modal>`: centered 640px on desktop (unchanged feel), full-screen sheet with a **pinned footer** and body-only scroll on phones. Services & Categories just swap their `<Modal>` for it. Doctors additionally splits its one long form into a 2-step `<Steps>` wizard (① Profile → ② Availability) and upgrades old-school controls (plain "select image" button → tappable avatar with a camera badge; directional Next/Back with icons; icon-led step headers).

**Tech Stack:** React 19, TypeScript, Ant Design 6.1.4, SCSS (component-scoped), i18next (uz default / ru / en), Vite.

## Global Constraints

- **AntD version:** `antd ^6.1.4` — use the v6 `styles={{ body, ... }}` API and the `footer` prop (no deprecated `bodyStyle`).
- **i18n:** Every user-facing string is a translation key across **all three** locales `public/locales/{uz,ru,en}/translation.json`. **Uzbek is the default/fallback.**
- **Import alias:** `@` → `src`.
- **No test runner on the frontend.** Do NOT add tests. Verify each task with `npm run lint` (runs `tsc -b`/ESLint) and, where noted, `npm run build` + manual browser QA at `http://localhost:5173`.
- **Breakpoint convention:** mobile = `!screens.md` via `Grid.useBreakpoint()` (matches every existing admin page).
- **All commands run from** `Otolor-uz-front-simple/`.
- **Don't touch AppointmentsPage** — it has no form modal (status buttons + Popconfirm only), so it's out of scope.
- **Commit style:** small, frequent commits; do not push unless asked.

---

## File Structure

- **Create** `src/components/admin/ResponsiveFormModal.tsx` — the shared responsive modal shell. One job: responsive sizing + pinned footer. Passes through all AntD `ModalProps` (`footer`, `onOk`, `okText`, `confirmLoading`, `destroyOnClose`, etc.).
- **Create** `src/components/admin/ResponsiveFormModal.scss` — mobile full-screen + flex layout so header/footer pin and body scrolls.
- **Modify** `src/components/admin/index.ts` — export the new component.
- **Modify** `src/pages/admin/categories/CategoriesPage.tsx` — swap `<Modal>` → `<ResponsiveFormModal>` (proves the shell on the simplest form).
- **Modify** `src/pages/admin/services/ServicesPage.tsx` — same swap.
- **Modify** `public/locales/{uz,ru,en}/translation.json` — add `adminDoctors.steps.{profile,availability}`.
- **Modify** `src/pages/admin/doctors/DoctorsPage.tsx` — replace `<Modal>` with `<ResponsiveFormModal>`, add 2-step wizard + wizard footer + `closeModal`/`handleStepChange`, upgrade avatar upload.
- **Modify** `src/pages/admin/doctors/DoctorsPage.scss` — styles for the wizard steps, pinned footer spacing, and the avatar camera badge.

---

## Task 1: Reusable `ResponsiveFormModal` shell

**Files:**
- Create: `src/components/admin/ResponsiveFormModal.tsx`
- Create: `src/components/admin/ResponsiveFormModal.scss`
- Modify: `src/components/admin/index.ts`

**Interfaces:**
- Produces: `ResponsiveFormModal` (default export + named export from `@/components/admin`). Props = AntD `ModalProps` with `width` narrowed to `number` (default `640`). On mobile (`!screens.md`) it renders full-screen with a pinned footer; on desktop it renders a centered `width`px modal. Consumers pass the exact same props they'd pass to `<Modal>` (`title`, `open`, `onCancel`, `onOk`, `okText`, `confirmLoading`, `destroyOnClose`, `footer`, `children`).

- [ ] **Step 1: Create the component**

Create `src/components/admin/ResponsiveFormModal.tsx`:

```tsx
/**
 * ResponsiveFormModal
 * Shared shell for admin form modals.
 * - Desktop (>=md): centered modal at `width` (default 640) — unchanged feel.
 * - Mobile (<md): full-screen sheet with a pinned footer and body-only scroll,
 *   so the primary action is always thumb-reachable on long forms.
 * Passes through every AntD ModalProp (footer, onOk, okText, confirmLoading, ...).
 */

import React from 'react';
import { Modal, Grid } from 'antd';
import type { ModalProps } from 'antd';
import './ResponsiveFormModal.scss';

const { useBreakpoint } = Grid;

export interface ResponsiveFormModalProps extends Omit<ModalProps, 'width'> {
  /** Desktop width in px. Ignored on mobile (always full-screen). */
  width?: number;
}

const ResponsiveFormModal: React.FC<ResponsiveFormModalProps> = ({
  width = 640,
  className,
  children,
  ...rest
}) => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const mergedClassName = [
    'responsive-form-modal',
    isMobile && 'responsive-form-modal--mobile',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Modal
      {...rest}
      width={isMobile ? '100%' : width}
      centered={!isMobile}
      style={isMobile ? { top: 0, maxWidth: '100vw', margin: 0, paddingBottom: 0 } : undefined}
      className={mergedClassName}
    >
      {children}
    </Modal>
  );
};

export default ResponsiveFormModal;
```

- [ ] **Step 2: Create the styles**

Create `src/components/admin/ResponsiveFormModal.scss`:

```scss
/**
 * ResponsiveFormModal styles
 * Footer becomes a right-aligned flex row (gap between buttons) everywhere.
 * On mobile the modal fills the viewport and uses a flex column so the
 * header + footer pin while only the body scrolls.
 */

.responsive-form-modal {
  .ant-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 0;
  }
}

.responsive-form-modal--mobile {
  max-width: 100vw;
  margin: 0;
  top: 0;
  padding-bottom: 0;
  height: 100dvh;

  .ant-modal-content {
    height: 100dvh;
    display: flex;
    flex-direction: column;
    border-radius: 0;
    padding: 0;
  }

  .ant-modal-header {
    flex-shrink: 0;
    padding: 16px 20px;
    margin-bottom: 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .ant-modal-body {
    flex: 1 1 auto;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 16px 20px;
  }

  .ant-modal-footer {
    flex-shrink: 0;
    padding: 12px 20px calc(12px + env(safe-area-inset-bottom));
    border-top: 1px solid #f0f0f0;
    background: #fff;
    margin-top: 0;
  }

  .ant-modal-close {
    top: 12px;
    inset-inline-end: 12px;
  }
}
```

- [ ] **Step 3: Export from the admin barrel**

In `src/components/admin/index.ts`, add after the existing exports:

```ts
export { default as ResponsiveFormModal } from './ResponsiveFormModal';
```

- [ ] **Step 4: Verify it type-checks / lints**

Run: `npm run lint`
Expected: PASS (no errors). The component is not yet used, so this only confirms it compiles.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/ResponsiveFormModal.tsx src/components/admin/ResponsiveFormModal.scss src/components/admin/index.ts
git commit -m "feat(admin): add ResponsiveFormModal shell (fullscreen sheet + pinned footer on mobile)"
```

---

## Task 2: Migrate Categories modal to the shell

Simplest form (2 fields) — proves the shell end-to-end.

**Files:**
- Modify: `src/pages/admin/categories/CategoriesPage.tsx`

**Interfaces:**
- Consumes: `ResponsiveFormModal` from `@/components/admin`.

- [ ] **Step 1: Swap the import**

In `src/pages/admin/categories/CategoriesPage.tsx`, remove `Modal` from the `antd` import list (lines ~2–17 — delete the `Modal,` line) and add this import after the `useAdminQueries` import block (near line ~33):

```tsx
import { ResponsiveFormModal } from '@/components/admin';
```

- [ ] **Step 2: Replace the modal element**

Replace the opening `<Modal` tag (line ~275) and its closing `</Modal>` (line ~313) with `<ResponsiveFormModal` / `</ResponsiveFormModal>`. Keep every existing prop and child unchanged. The result:

```tsx
      <ResponsiveFormModal
        title={editingCategory ? t('adminCategories.modal.editTitle') : t('adminCategories.modal.addTitle')}
        open={modalOpen}
        onCancel={closeModal}
        onOk={handleSubmit}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        okText={editingCategory ? t('adminCategories.modal.update') : t('adminCategories.modal.create')}
        destroyOnClose
      >
        {/* ...existing <Form> ... unchanged... */}
      </ResponsiveFormModal>
```

- [ ] **Step 3: Verify**

Run: `npm run lint`
Expected: PASS. No unused `Modal` import remains.

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/categories/CategoriesPage.tsx
git commit -m "feat(admin): categories modal uses ResponsiveFormModal"
```

---

## Task 3: Migrate Services modal to the shell

**Files:**
- Modify: `src/pages/admin/services/ServicesPage.tsx`

**Interfaces:**
- Consumes: `ResponsiveFormModal` from `@/components/admin`.

- [ ] **Step 1: Swap the import**

In `src/pages/admin/services/ServicesPage.tsx`, remove `Modal,` from the `antd` import list (lines ~2–19) and add after the `useAdminQueries` import block (near line ~36):

```tsx
import { ResponsiveFormModal } from '@/components/admin';
```

- [ ] **Step 2: Replace the modal element**

Replace the opening `<Modal` (line ~323) and closing `</Modal>` (line ~378) with `<ResponsiveFormModal` / `</ResponsiveFormModal>`. Keep the existing `width={640}` and all other props/children unchanged:

```tsx
      <ResponsiveFormModal
        title={editingService ? t('adminServices.modal.editTitle') : t('adminServices.modal.addTitle')}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setEditingService(null);
          form.resetFields();
        }}
        onOk={handleSubmit}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        okText={editingService ? t('adminServices.modal.update') : t('adminServices.modal.create')}
        width={640}
        destroyOnClose
      >
        {/* ...existing <Form<ServiceFormValues>> ... unchanged... */}
      </ResponsiveFormModal>
```

- [ ] **Step 3: Verify**

Run: `npm run lint`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/services/ServicesPage.tsx
git commit -m "feat(admin): services modal uses ResponsiveFormModal"
```

---

## Task 4: Add Doctor wizard i18n keys

**Files:**
- Modify: `public/locales/uz/translation.json`
- Modify: `public/locales/ru/translation.json`
- Modify: `public/locales/en/translation.json`

**Interfaces:**
- Produces: `adminDoctors.steps.profile` and `adminDoctors.steps.availability` in all three locales (used by Task 5).

> Note: `common.back` and `common.next` already exist in all three locales — do NOT re-add them.

- [ ] **Step 1: Add `steps` to Uzbek (default)**

In `public/locales/uz/translation.json`, inside the `adminDoctors` object, add a `steps` key alongside the existing `modal` key:

```json
    "steps": {
      "profile": "Ma'lumotlar",
      "availability": "Ish jadvali"
    },
```

- [ ] **Step 2: Add `steps` to Russian**

In `public/locales/ru/translation.json`, inside `adminDoctors`:

```json
    "steps": {
      "profile": "Профиль",
      "availability": "Расписание"
    },
```

- [ ] **Step 3: Add `steps` to English**

In `public/locales/en/translation.json`, inside `adminDoctors`:

```json
    "steps": {
      "profile": "Profile",
      "availability": "Availability"
    },
```

- [ ] **Step 4: Verify JSON is valid**

Run: `node -e "['uz','ru','en'].forEach(l=>{const j=require('./public/locales/'+l+'/translation.json'); if(!j.adminDoctors.steps.profile||!j.adminDoctors.steps.availability) throw new Error('missing steps in '+l); }); console.log('OK')"`
Expected: prints `OK` (valid JSON + keys present in all three).

- [ ] **Step 5: Commit**

```bash
git add public/locales/uz/translation.json public/locales/ru/translation.json public/locales/en/translation.json
git commit -m "i18n(admin): add doctor wizard step labels"
```

---

## Task 5: Doctors — 2-step wizard + shell + avatar upgrade

Converts the heavy Doctor modal into a paged wizard inside the responsive shell, and replaces the old-school "Select image" button with a tappable avatar + camera badge. Both steps stay mounted (hidden via `display:none`) so AntD Form fields stay registered and `validateFields` + schedule state survive step switches.

**Files:**
- Modify: `src/pages/admin/doctors/DoctorsPage.tsx`

**Interfaces:**
- Consumes: `ResponsiveFormModal` from `@/components/admin`; i18n keys `adminDoctors.steps.*`, `common.next`, `common.back` (Task 4).
- Produces: local helpers `closeModal()` and `handleStepChange(target: number)`; local state `step` (`0 | 1`).

- [ ] **Step 1: Update imports**

In `src/pages/admin/doctors/DoctorsPage.tsx`:

- Remove `Modal,` from the `antd` import list (lines ~8–27).
- Add `Steps,` to that same `antd` import list.
- Add these icons to the `@ant-design/icons` import (lines ~30–38): `UserOutlined`, `CalendarOutlined`, `CameraOutlined`, `LeftOutlined`, `RightOutlined`, `CheckOutlined`, `StarOutlined`.
- Add after the `useAdminQueries` import block (near line ~50):

```tsx
import { ResponsiveFormModal } from '@/components/admin';
```

- [ ] **Step 2: Add `step` state**

After the existing `const [modalOpen, setModalOpen] = useState(false);` (line ~67), add:

```tsx
  const [step, setStep] = useState(0);
```

- [ ] **Step 3: Reset step when opening either modal**

In `openCreateModal` (add before `setModalOpen(true);` at line ~99) and in `openEditModal` (add before `setModalOpen(true);` at line ~113), add:

```tsx
    setStep(0);
```

- [ ] **Step 4: Add `closeModal` and `handleStepChange` helpers**

Add these two functions right after `openEditModal` (after line ~114), before `handleDelete`:

```tsx
  const closeModal = () => {
    setModalOpen(false);
    setEditingDoctor(null);
    form.resetFields();
    setAvatarUrl(undefined);
    setSelectedAvatarFile(null);
    setStep(0);
  };

  // Steps are clickable. Moving forward first validates the profile fields;
  // moving back is always allowed.
  const handleStepChange = async (target: number) => {
    if (target > step) {
      try {
        await form.validateFields(['name', 'specialization', 'experience']);
      } catch {
        return; // inline field errors are shown by AntD
      }
    }
    setStep(target);
  };
```

- [ ] **Step 5: Replace the entire modal block**

Replace the whole `{/* Create / Edit Modal */}` block (lines ~408–495, from `<Modal` through `</Modal>`) with this wizard version:

```tsx
      {/* Create / Edit Modal — 2-step wizard (Profile → Availability) */}
      <ResponsiveFormModal
        title={editingDoctor ? t('adminDoctors.modal.editTitle') : t('adminDoctors.modal.addTitle')}
        open={modalOpen}
        onCancel={closeModal}
        width={640}
        destroyOnClose
        className="doctor-modal"
        footer={
          <>
            {step === 0 ? (
              <Button onClick={closeModal}>{t('common.cancel')}</Button>
            ) : (
              <Button icon={<LeftOutlined />} onClick={() => setStep(0)}>
                {t('common.back')}
              </Button>
            )}
            {step === 0 ? (
              <Button type="primary" onClick={() => handleStepChange(1)}>
                {t('common.next')}
                <RightOutlined />
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<CheckOutlined />}
                loading={createMutation.isPending || updateMutation.isPending || avatarUploading}
                onClick={handleSubmit}
              >
                {editingDoctor ? t('adminDoctors.modal.update') : t('adminDoctors.modal.create')}
              </Button>
            )}
          </>
        }
      >
        <Steps
          size="small"
          current={step}
          onChange={handleStepChange}
          responsive={false}
          className="doctor-modal__steps"
          items={[
            { title: t('adminDoctors.steps.profile'), icon: <UserOutlined /> },
            { title: t('adminDoctors.steps.availability'), icon: <CalendarOutlined /> },
          ]}
        />

        <Form form={form} layout="vertical">
          {/* Step 1: Profile */}
          <div style={{ display: step === 0 ? 'block' : 'none' }}>
            <Form.Item label={t('adminDoctors.form.avatarLabel')}>
              <div className="doctor-avatar-upload-wrap">
                <Upload {...uploadProps} fileList={selectedAvatarFileList} showUploadList={false}>
                  <div className="doctor-avatar-upload">
                    <Avatar size={72} src={avatarUrl}>
                      {(form.getFieldValue('name') || 'D').charAt(0).toUpperCase()}
                    </Avatar>
                    <span className="doctor-avatar-upload__overlay">
                      <CameraOutlined />
                    </span>
                  </div>
                </Upload>
                <div className="doctor-avatar-upload__meta">
                  <Text strong>
                    {selectedAvatarFile ? selectedAvatarFile.name : t('adminDoctors.form.selectImage')}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {t('adminDoctors.form.avatarHelp')}
                  </Text>
                </div>
              </div>
            </Form.Item>

            <Form.Item
              name="name"
              label={t('adminDoctors.form.nameLabel')}
              rules={[
                { required: true, message: t('adminDoctors.form.validation.nameRequired') },
                { min: 2, message: t('adminDoctors.form.validation.nameMin') },
                { max: 100, message: t('adminDoctors.form.validation.nameMax') },
              ]}
            >
              <Input placeholder={t('adminDoctors.form.namePlaceholder')} />
            </Form.Item>

            <Form.Item
              name="specialization"
              label={t('adminDoctors.form.specializationLabel')}
              rules={[{ max: 100, message: t('adminDoctors.form.validation.specializationMax') }]}
            >
              <Input placeholder={t('adminDoctors.form.specializationPlaceholder')} />
            </Form.Item>

            <Form.Item
              name="experience"
              label={t('adminDoctors.form.experienceLabel')}
              rules={[
                { type: 'number', min: 0, max: 80, message: t('adminDoctors.form.validation.experienceRange') },
              ]}
            >
              <InputNumber
                min={0}
                max={80}
                style={{ width: '100%' }}
                placeholder={t('adminDoctors.form.experiencePlaceholder')}
              />
            </Form.Item>

            <Form.Item
              name="isFeatured"
              label={
                <Space size={6}>
                  <StarOutlined />
                  {t('adminDoctors.form.featuredLabel')}
                </Space>
              }
              valuePropName="checked"
              tooltip={t('adminDoctors.form.featuredHelp')}
            >
              <Switch />
            </Form.Item>
          </div>

          {/* Step 2: Availability */}
          <div style={{ display: step === 1 ? 'block' : 'none' }}>
            <ScheduleEditor
              days={schedule.next7Days}
              enabledDates={schedule.enabledDates}
              dateTimeRanges={schedule.dateTimeRanges}
              onToggle={schedule.toggleDate}
              onRangeChange={schedule.updateTimeRange}
            />
          </div>
        </Form>
      </ResponsiveFormModal>
```

- [ ] **Step 6: Verify**

Run: `npm run lint`
Expected: PASS. No unused `Modal` import; all new icons imported; `Text` (already destructured from `Typography` at line ~55) is in use.

- [ ] **Step 7: Commit**

```bash
git add src/pages/admin/doctors/DoctorsPage.tsx
git commit -m "feat(admin): doctor form becomes a 2-step wizard with tappable avatar upload"
```

---

## Task 6: Doctors — wizard & avatar styles

**Files:**
- Modify: `src/pages/admin/doctors/DoctorsPage.scss`

**Interfaces:**
- Consumes: class names emitted in Task 5 (`doctor-modal__steps`, `doctor-avatar-upload-wrap`, `doctor-avatar-upload`, `doctor-avatar-upload__overlay`, `doctor-avatar-upload__meta`).

- [ ] **Step 1: Add wizard + avatar styles**

Append to `src/pages/admin/doctors/DoctorsPage.scss` (after the schedule styles, before or after the `@media` block — top level, not nested inside `.doctors-page`):

```scss
/* Doctor create/edit wizard */
.doctor-modal {
  &__steps {
    margin-bottom: 24px;
  }
}

/* Tappable avatar upload (replaces the old "Select image" button) */
.doctor-avatar-upload-wrap {
  display: flex;
  align-items: center;
  gap: 16px;
}

.doctor-avatar-upload {
  position: relative;
  cursor: pointer;
  line-height: 0;
  border-radius: 50%;

  &__overlay {
    position: absolute;
    right: -2px;
    bottom: -2px;
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1677ff;
    color: #fff;
    border: 2px solid #fff;
    border-radius: 50%;
    font-size: 13px;
    transition: transform 0.15s ease;
  }

  &:hover &__overlay {
    transform: scale(1.08);
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
}
```

- [ ] **Step 2: Verify build compiles SCSS**

Run: `npm run build`
Expected: PASS (`tsc -b && vite build` completes; SCSS compiles with no errors).

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/doctors/DoctorsPage.scss
git commit -m "style(admin): doctor wizard steps + avatar camera badge"
```

---

## Task 7: Manual QA pass (all breakpoints)

**Files:** none (verification only).

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Open `http://localhost:5173/admins-otolor` and log in.

- [ ] **Step 2: Desktop checks (browser wide)**

Verify each of the following:
- **Categories** → Add/Edit: centered modal, footer buttons right-aligned with a gap. Create + edit still save.
- **Services** → Add/Edit: centered 640px modal, all 4 fields present, saves.
- **Doctors** → Add: `<Steps>` shows ① Profile / ② Availability with icons. Avatar shows a camera badge; clicking it opens the file picker; selecting an image shows the filename next to it. **Next** validates (leave name empty → error, don't advance; fill name → advances). **Back** returns to Profile with values intact. Step 2 shows the 7-day schedule; **Create** saves. Edit an existing doctor: profile prefilled, schedule prefilled, update saves.

- [ ] **Step 3: Mobile checks (DevTools device toolbar, e.g. iPhone SE 375px)**

For **Doctors**, **Services**, **Categories** Add/Edit:
- Modal fills the screen (no cramped centered box, no horizontal overflow).
- Header stays pinned at top, footer pinned at bottom; only the middle scrolls.
- Primary button is always visible without scrolling.
- Doctors step 2: each schedule row stacks vertically and the time-range picker is full-width and tappable.

- [ ] **Step 4: Final lint gate**

Run: `npm run lint`
Expected: PASS.

- [ ] **Step 5: (Optional) squash/tidy note**

If everything passes, the branch is ready. Do not push or open a PR unless asked.

---

## Self-Review Notes

- **Spec coverage:** responsive shell (Tasks 1–3), Doctors 2-step wizard (Tasks 4–6), mobile schedule (already present in `DoctorsPage.scss:167`, confirmed in Task 7 Step 3), old-school → intuitive upgrades (avatar camera badge, icon-led steps, directional Next/Back, star-icon featured label — Tasks 5–6). Appointments intentionally excluded (no form modal). ✅
- **Type consistency:** `ResponsiveFormModal` accepts standard `ModalProps`; `handleStepChange(target: number)` and `closeModal()` names match every call site; `step` state is `0 | 1` used consistently. ✅
- **No placeholders:** every code step contains full, paste-ready content. ✅
- **i18n:** `common.back`/`common.next` reused (already exist); only `adminDoctors.steps.*` added, in all three locales. ✅
