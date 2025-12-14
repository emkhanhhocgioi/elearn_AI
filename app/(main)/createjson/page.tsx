'use client';
import { useState, ChangeEvent } from 'react';
import { Download, Plus, Trash2, FileJson, FileCode } from 'lucide-react';

interface OutputData {
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface JsonlEntry {
  task: string;
  instruction: string;
  output: OutputData;
}

interface FormData {
  task: string;
  instruction: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function JsonlCreator() {
  const [entries, setEntries] = useState<JsonlEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<FormData>({
    task: 'math_question_generation',
    instruction: 'Tạo một câu hỏi toán học về dạng toán tập hợp cho học sinh lớp 6',
    question: '',
    answer: '',
    difficulty: 'medium'
  });
  const [rawJson, setRawJson] = useState('');
  const [showJsonInput, setShowJsonInput] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setCurrentEntry(prev => ({ ...prev, [field]: value }));
  };

  const addEntry = () => {
    if (!currentEntry.task || !currentEntry.instruction || !currentEntry.question || !currentEntry.answer) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const newEntry: JsonlEntry = {
      task: currentEntry.task,
      instruction: currentEntry.instruction,
      output: {
        question: currentEntry.question,
        answer: currentEntry.answer,
        difficulty: currentEntry.difficulty
      }
    };

    setEntries(prev => [...prev, newEntry]);
    
    // Reset form
    setCurrentEntry({
      task: 'math_question_generation',
      instruction: 'Tạo một câu hỏi toán học về dạng toán tập hợp cho học sinh lớp 6',
      question: '',
      answer: '',
      difficulty: 'medium'
    });
  };

  const addFromRawJson = () => {
    try {
      const parsed = JSON.parse(rawJson);
      
      // Check if it's an array or single object
      if (Array.isArray(parsed)) {
        const validEntries = parsed.filter(entry => 
          entry.task && entry.instruction && entry.output?.question && entry.output?.answer
        );
        if (validEntries.length === 0) {
          alert('Không tìm thấy entry hợp lệ trong JSON!');
          return;
        }
        setEntries(prev => [...prev, ...validEntries]);
        alert(`Đã thêm ${validEntries.length} entries thành công!`);
      } else {
        if (!parsed.task || !parsed.instruction || !parsed.output?.question || !parsed.output?.answer) {
          alert('JSON không đúng định dạng! Cần có: task, instruction, output.question, output.answer');
          return;
        }
        setEntries(prev => [...prev, parsed]);
        alert('Đã thêm 1 entry thành công!');
      }
      
      setRawJson('');
      setShowJsonInput(false);
    } catch (error) {
      alert('JSON không hợp lệ! Vui lòng kiểm tra lại cú pháp.');
    }
  };

  const removeEntry = (index: number) => {
    setEntries(prev => prev.filter((_, i) => i !== index));
  };

  const downloadJsonl = () => {
    if (entries.length === 0) {
      alert('Chưa có dữ liệu để tải xuống!');
      return;
    }

    const jsonlContent = entries.map(entry => JSON.stringify(entry)).join('\n');
    const blob = new Blob([jsonlContent], { type: 'application/jsonl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data_${Date.now()}.jsonl`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    if (confirm('Bạn có chắc muốn xóa tất cả dữ liệu?')) {
      setEntries([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileJson className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-800">JSONL Creator</h1>
            </div>
            <div className="text-sm text-gray-600">
              Số entries: <span className="font-bold text-indigo-600">{entries.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Task
              </label>
              <input
                type="text"
                value={currentEntry.task}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('task', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Nhập task..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Instruction
              </label>
              <input
                type="text"
                value={currentEntry.instruction}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('instruction', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Nhập instruction..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Question
              </label>
              <textarea
                value={currentEntry.question}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('question', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows={3}
                placeholder="Nhập question..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Answer
              </label>
              <textarea
                value={currentEntry.answer}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('answer', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows={3}
                placeholder="Nhập answer..."
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              value={currentEntry.difficulty}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => handleInputChange('difficulty', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={addEntry}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              <Plus className="w-5 h-5" />
              Thêm Entry
            </button>

            <button
              onClick={() => setShowJsonInput(!showJsonInput)}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              <FileCode className="w-5 h-5" />
              {showJsonInput ? 'Ẩn JSON Input' : 'Thêm từ JSON'}
            </button>
            
            <button
              onClick={downloadJsonl}
              disabled={entries.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5" />
              Tải JSONL
            </button>

            <button
              onClick={clearAll}
              disabled={entries.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-5 h-5" />
              Xóa Tất Cả
            </button>
          </div>
        </div>

        {showJsonInput && (
          <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Thêm từ Raw JSON</h2>
            <p className="text-sm text-gray-600 mb-4">
              Nhập JSON object hoặc array. Định dạng: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{`{"task": "...", "instruction": "...", "output": {"question": "...", "answer": "...", "difficulty": "..."}}`}</code>
            </p>
            <textarea
              value={rawJson}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setRawJson(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
              rows={10}
              placeholder={`Ví dụ single object:
{
  "task": "math_question_generation",
  "instruction": "Tạo câu hỏi toán...",
  "output": {
    "question": "Cho tập hợp A = {1, 2, 3}...",
    "answer": "Đáp án: ...",
    "difficulty": "medium"
  }
}

Hoặc array:
[
  {...},
  {...}
]`}
            />
            <div className="flex gap-4 mt-4">
              <button
                onClick={addFromRawJson}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                <Plus className="w-5 h-5" />
                Thêm JSON
              </button>
              <button
                onClick={() => {
                  setRawJson('');
                  setShowJsonInput(false);
                }}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        {entries.length > 0 && (
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Danh Sách Entries</h2>
            <div className="space-y-4">
              {entries.map((entry, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <span className="font-semibold text-gray-700">Task:</span>
                          <p className="text-gray-600">{entry.task}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Instruction:</span>
                          <p className="text-gray-600">{entry.instruction}</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="mb-2">
                          <span className="font-semibold text-gray-700">Question:</span>
                          <p className="text-gray-600">{entry.output.question}</p>
                        </div>
                        <div className="mb-2">
                          <span className="font-semibold text-gray-700">Answer:</span>
                          <p className="text-gray-600">{entry.output.answer}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Difficulty:</span>
                          <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                            entry.output.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                            entry.output.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {entry.output.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeEntry(index)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}