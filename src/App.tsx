/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Copy, Check, X, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const InputField = ({ label, value, onChange }: { label: string; value: string; onChange: (val: string) => void }) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm outline-none transition-shadow"
    />
  </div>
);

const TextAreaField = ({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (val: string) => void; rows?: number }) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm outline-none transition-shadow resize-none"
    />
  </div>
);

const SelectField = ({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (val: string) => void }) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm outline-none transition-shadow bg-white text-slate-700"
    >
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

function useOptions(initialOptions: string[]) {
  const [options, setOptions] = useState<string[]>(initialOptions);
  const [value, setValue] = useState<string>(options[0] || '');

  const addOption = (val: string) => setOptions((prev) => [...prev, val]);
  const editOption = (oldVal: string, newVal: string) => {
    setOptions((prev) => prev.map((o) => (o === oldVal ? newVal : o)));
    if (value === oldVal) setValue(newVal);
  };
  const deleteOption = (val: string) => {
    setOptions((prev) => {
      const next = prev.filter((o) => o !== val);
      if (value === val) setValue(next[0] || '');
      return next;
    });
  };

  return { value, setValue, options, addOption, editOption, deleteOption };
}

type OptionState = ReturnType<typeof useOptions>;

const OptionSelect = ({
  label,
  state,
  isTextArea = false
}: {
  label: string;
  state: OptionState;
  isTextArea?: boolean;
}) => {
  const { value, setValue, options, addOption, editOption, deleteOption } = state;
  const [mode, setMode] = useState<'view' | 'add' | 'edit'>('view');
  const [inputValue, setInputValue] = useState("");

  const handleSave = () => {
    if (inputValue.trim()) {
      if (mode === 'add') {
        addOption(inputValue.trim());
        setValue(inputValue.trim());
      } else if (mode === 'edit') {
        editOption(value, inputValue.trim());
      }
    }
    setMode('view');
    setInputValue("");
  };

  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{label}</label>
      {mode !== 'view' ? (
        <div className="flex gap-2 items-start">
          {isTextArea ? (
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm outline-none transition-shadow resize-none"
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm outline-none transition-shadow"
              autoFocus
            />
          )}
          <button 
            onClick={handleSave} 
            className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-sm transition-colors shrink-0 flex items-center justify-center h-9 w-9"
            title="Save"
          >
            <Check className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setMode('view')} 
            className="p-2 bg-slate-200 text-slate-600 rounded-md hover:bg-slate-300 shadow-sm transition-colors shrink-0 flex items-center justify-center h-9 w-9"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex gap-1 items-stretch">
          <select
            value={value}
            onChange={(e) => {
              if (e.target.value === '__add_new__') {
                setMode('add');
                setInputValue("");
              } else {
                setValue(e.target.value);
              }
            }}
            className="flex-1 min-w-0 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm outline-none transition-shadow bg-white text-slate-700"
          >
            {options.map((opt, idx) => (
              <option key={idx} value={opt}>{opt}</option>
            ))}
            <option value="__add_new__" className="font-semibold text-indigo-600">➕ Add new option...</option>
          </select>
          {options.length > 0 && value !== '__add_new__' && (
            <>
              <button
                onClick={() => {
                  setMode('edit');
                  setInputValue(value);
                }}
                className="px-2.5 text-slate-400 hover:text-indigo-600 bg-white border border-slate-300 rounded-md shadow-sm transition-colors flex items-center justify-center shrink-0"
                title="Edit selected option"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm('Delete this option?')) {
                    deleteOption(value);
                  }
                }}
                className="px-2.5 text-slate-400 hover:text-red-600 bg-white border border-slate-300 rounded-md shadow-sm transition-colors flex items-center justify-center shrink-0"
                title="Delete selected option"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'greeting' | 'reminder' | 'event'>('greeting');
  const [copied, setCopied] = useState(false);

  // --- Greeting & Reminder States ---
  const [name, setName] = useState('');
  
  const dayOptions = ['Tuesday', 'Wednesday', 'Thursday'];
  const [day, setDay] = useState(dayOptions[0]);

  // --- Option States ---
  const addressState = useOptions([
    '55 River Dr S, Apt 1214, Jersey City NJ',
    '18 W 33rd Street, New York, NY'
  ]);
  const shuttleState = useOptions([
    'in front of Starbucks at 111 townsquare pl at Newport path station',
    'in front of Mixue at 1271 Broadway & 32nd St, New York, NY 10001'
  ]);

  // --- Reminder States & Options ---
  const timeWindowState = useOptions(['tomorrow evening', 'tonight']);
  const locationState = useOptions(['Newport', 'Manhattan']);
  const specificAddressState = useOptions([
    "Pin's place (55 River Dr S apt1214)",
    "33rd street right across from the Empire State Building: (18 W 33rd Street) https://share.google/TesGQUKqehtWAbRpe"
  ]);

  const relativeDay = timeWindowState.value === 'tonight' ? 'tonight' : 'tomorrow';

  // --- Event Invitation States ---
  const [eventTime, setEventTime] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  // Generate Messages dynamically based on state
  const greetingMessage = `Hello${name ? ' ' + name : ''}! Hope your week is going well😊 Here is the information about our church you can check out: https://linktr.ee/coj\n\nthe Bible study we mentioned are ${day} at 7:30 PM at ${addressState.value}\n\nOur Sunday service is at 10:00 AM. The church shuttle picks up ${shuttleState.value} and departs at 9:00 AM every Sunday. If you have any questions, feel free to ask me!`;

  const reminderMessage = `Hello${name ? ' ' + name : ''}! Hope your week is going well😊\n\nJust a reminder that ${timeWindowState.value} we will have the bible study meeting at ${locationState.value} from 7:30pm\n\nWe will gather at ${specificAddressState.value}. Call me if you have any issues finding the address. Hopefully you can join us ${relativeDay}!`;

  const eventMessage = `Hello${name ? ' ' + name : ''}! Hope everything is well with you!\nAs we mentioned we that ${eventTime} we will have ${eventName} at ${eventLocation}\nPlease let me know if you can make it.`;

  const currentMessage = activeTab === 'greeting' ? greetingMessage : (activeTab === 'reminder' ? reminderMessage : eventMessage);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(currentMessage);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = currentMessage;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col font-sans text-slate-900 overflow-hidden">

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar / Input Panel */}
        <aside className="w-full md:w-[520px] shrink-0 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col overflow-y-auto md:overflow-visible">
          <div className="p-8 space-y-6 flex-1 overflow-y-auto">
            {/* Template Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Select Message Template</label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-lg">
                <button
                  onClick={() => setActiveTab('greeting')}
                  className={`py-2 px-4 text-sm font-semibold rounded-md transition-all ${
                    activeTab === 'greeting'
                      ? 'bg-white shadow-sm text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Greeting
                </button>
                <button
                  onClick={() => setActiveTab('reminder')}
                  className={`py-2 px-4 text-sm font-semibold rounded-md transition-all ${
                    activeTab === 'reminder'
                      ? 'bg-white shadow-sm text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Reminder
                </button>
                <button
                  onClick={() => setActiveTab('event')}
                  className={`py-2 px-4 text-sm font-semibold rounded-md transition-all ${
                    activeTab === 'event'
                      ? 'bg-white shadow-sm text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Event
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {activeTab === 'greeting' && (
                  <motion.div
                    key="greeting-form"
                    initial={{ opacity: 0, scale: 0.98, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <InputField label="Recipient Name" value={name} onChange={setName} />
                    <SelectField label="Bible Study Day" value={day} onChange={setDay} options={dayOptions} />
                    <OptionSelect label="Bible Study Address" state={addressState} isTextArea />
                    <OptionSelect label="Shuttle Pickup Location" state={shuttleState} isTextArea />
                  </motion.div>
                )}
                {activeTab === 'reminder' && (
                  <motion.div
                    key="reminder-form"
                    initial={{ opacity: 0, scale: 0.98, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <InputField label="Recipient Name" value={name} onChange={setName} />
                    <OptionSelect label="Time Window" state={timeWindowState} />
                    <OptionSelect label="Location" state={locationState} />
                    <OptionSelect label="Specific Address" state={specificAddressState} isTextArea />
                  </motion.div>
                )}
                {activeTab === 'event' && (
                  <motion.div
                    key="event-form"
                    initial={{ opacity: 0, scale: 0.98, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <InputField label="Recipient Name" value={name} onChange={setName} />
                    <InputField label="Event Time" value={eventTime} onChange={setEventTime} />
                    <InputField label="Event Name" value={eventName} onChange={setEventName} />
                    <TextAreaField label="Event Location" value={eventLocation} onChange={setEventLocation} rows={2} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="p-8 border-t border-slate-100 bg-slate-50 shrink-0">
            <button
              onClick={handleCopy}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>Copy Final Message</span>
                </>
              )}
            </button>
          </div>
        </aside>

        {/* Preview Area */}
        <main className="hidden md:flex flex-1 p-6 md:p-8 flex-col overflow-y-auto bg-slate-50">
          <div className="mb-6 shrink-0">
            <h2 className="text-lg font-bold text-slate-800">Message Preview</h2>
            <p className="text-sm text-slate-500">This is exactly how the message will appear to the recipient.</p>
          </div>

          {/* Mobile Phone Mockup */}
          <div className="flex-1 flex justify-center items-start min-h-0">
            <div className="w-full max-w-md bg-white rounded-[40px] border-[12px] border-slate-800 shadow-2xl overflow-hidden aspect-[9/18.5] flex flex-col max-h-full">
              <div className="bg-slate-100 h-14 shrink-0 flex items-center justify-center border-b border-slate-200">
                <div className="text-xs font-bold text-slate-400">iMessage</div>
              </div>
              <div className="flex-1 p-4 bg-white overflow-y-auto flex flex-col">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentMessage}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-[85%] bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-none text-sm ml-auto shadow-sm whitespace-pre-wrap leading-relaxed"
                  >
                    {currentMessage}
                  </motion.div>
                </AnimatePresence>
                <div className="mt-1 text-[10px] text-slate-400 text-right mr-1">Delivered</div>
              </div>
              <div className="h-16 shrink-0 border-t border-slate-100 p-3 flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-300 text-xl font-light">+</div>
                <div className="flex-1 h-8 bg-slate-100 border border-slate-200 rounded-full px-3 text-[10px] flex items-center text-slate-400">iMessage...</div>
              </div>
            </div>
          </div>

          {/* Stats Footer (Optional per target design) - Added below the phone */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0">
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
              <div className="text-xs font-bold text-emerald-400 uppercase mb-1">Character Count</div>
              <div className="text-sm text-emerald-900 font-medium">{currentMessage.length} Characters</div>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <div className="text-xs font-bold text-amber-400 uppercase mb-1">Estimated SMS</div>
              <div className="text-sm text-amber-900 font-medium">{Math.ceil(currentMessage.length / 160)} Segment{Math.ceil(currentMessage.length / 160) !== 1 ? 's' : ''}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
