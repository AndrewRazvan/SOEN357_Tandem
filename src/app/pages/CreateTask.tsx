import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { ScreenHeader } from '../components/ui/ScreenHeader';

export function CreateTask() {
  const navigate = useNavigate();
  const { addTask } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!name.trim()) return;
    const id = addTask(name.trim(), description.trim() || undefined);
    navigate(`/rate/${id}/alex`);
  };

  return (
    <div className="flex flex-col min-h-full pb-10">
      <ScreenHeader
        title="New Task"
        subtitle="Describe what needs doing — keep it clear and neutral."
        backTo="/"
      />

      <div className="px-5 flex flex-col gap-4">
        {/* Task name */}
        <div>
          <label
            htmlFor="task-name"
            style={{ fontSize: '13px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: 8 }}
          >
            Task name
          </label>
          <input
            id="task-name"
            type="text"
            placeholder="e.g. Vacuum the living room"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className="w-full rounded-2xl px-4 py-4 outline-none transition-all"
            style={{
              background: '#FFFFFF',
              border: '1.5px solid transparent',
              fontSize: '16px',
              color: '#1C1C1E',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = '1.5px solid #7B9D8F';
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = '1.5px solid transparent';
            }}
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="task-desc"
            style={{ fontSize: '13px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: 8 }}
          >
            Description{' '}
            <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
          </label>
          <textarea
            id="task-desc"
            placeholder="Any context that would help the other person understand…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-2xl px-4 py-4 outline-none transition-all resize-none"
            style={{
              background: '#FFFFFF',
              border: '1.5px solid transparent',
              fontSize: '15px',
              color: '#1C1C1E',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = '1.5px solid #7B9D8F';
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = '1.5px solid transparent';
            }}
          />
        </div>

        {/* Info card */}
        <div
          className="rounded-2xl p-4 flex gap-3"
          style={{ background: '#EEF5F2' }}
        >
          <span style={{ fontSize: '18px', lineHeight: 1 }}>🔒</span>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#3D7A65' }}>
              Private ratings come next
            </p>
            <p className="mt-0.5" style={{ fontSize: '13px', color: '#5A7A6E', fontWeight: 400 }}>
              After saving, each of you will rate how burdensome this task feels — separately and privately.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 mt-auto pt-8">
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full py-4 rounded-2xl transition-all active:scale-[0.98]"
          style={{
            background: name.trim() ? '#7B9D8F' : '#EFEDE8',
            color: name.trim() ? '#FFFFFF' : '#B0ADAA',
            fontSize: '16px',
            fontWeight: 500,
            minHeight: 56,
          }}
        >
          Save Task
        </button>
        <p className="text-center mt-3" style={{ fontSize: '13px', color: '#8E8E93' }}>
          You'll each rate the burden privately on the next screen.
        </p>
      </div>
    </div>
  );
}
