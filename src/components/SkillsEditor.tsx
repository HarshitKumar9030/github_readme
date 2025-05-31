'use client';

import React from 'react';
import { Trash2, Plus } from 'lucide-react';
import HydrationSafeWrapper from './HydrationSafeWrapper';

interface Skill {
  name: string;
  level: number;
  color?: string;
}

interface SkillsEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const defaultColors = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
];

const SkillsEditorContent: React.FC<SkillsEditorProps> = ({ value, onChange, label = 'Skills' }) => {
  // Parse skills from value with fallback to defaults
  const parseSkills = (): Skill[] => {
    try {
      if (value && value.trim()) {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to defaults on parse error
    }
    
    // Return default skills
    return [
      { name: 'JavaScript', level: 90, color: '#F1E05A' },
      { name: 'TypeScript', level: 85, color: '#3178C6' },
      { name: 'React', level: 80, color: '#61DAFB' }
    ];
  };

  const skills = parseSkills();

  const updateSkills = (newSkills: Skill[]) => {
    onChange(JSON.stringify(newSkills, null, 2));
  };

  const addSkill = () => {
    const newSkill: Skill = {
      name: 'New Skill',
      level: 50,
      color: defaultColors[skills.length % defaultColors.length]
    };
    updateSkills([...skills, newSkill]);
  };

  const removeSkill = (index: number) => {
    updateSkills(skills.filter((_, i) => i !== index));
  };

  const updateSkill = (index: number, field: keyof Skill, value: string | number) => {
    const newSkills = [...skills];
    if (field === 'level') {
      newSkills[index] = { ...newSkills[index], [field]: Number(value) };
    } else {
      newSkills[index] = { ...newSkills[index], [field]: value };
    }
    updateSkills(newSkills);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <button
          type="button"
          onClick={addSkill}
          className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Skill
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {skills.map((skill, index) => (
          <div key={index} className="border rounded-md p-3 bg-gray-50 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={skill.name}
                onChange={(e) => updateSkill(index, 'name', e.target.value)}
                placeholder="Skill name"
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="p-1 text-red-600 hover:bg-red-100 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-600 w-12">Level:</label>
              <input
                type="range"
                min="0"
                max="100"
                value={skill.level}
                onChange={(e) => updateSkill(index, 'level', parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-xs text-gray-600 w-8">{skill.level}%</span>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-600 w-12">Color:</label>
              <input
                type="color"
                value={skill.color || '#3B82F6'}
                onChange={(e) => updateSkill(index, 'color', e.target.value)}
                className="w-8 h-6 rounded border border-gray-300"
              />
              <div className="flex gap-1">
                {defaultColors.slice(0, 5).map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => updateSkill(index, 'color', color)}
                    className="w-4 h-4 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={`Set color to ${color}`}
                  />
                ))}
              </div>
            </div>
            
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${skill.level}%`,
                    backgroundColor: skill.color || '#3B82F6'
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>      {skills.length === 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          No skills added yet. Click &quot;Add Skill&quot; to get started.
        </div>
      )}
    </div>
  );
};

const SkillsEditor: React.FC<SkillsEditorProps> = (props) => {
  return (
    <HydrationSafeWrapper>
      <SkillsEditorContent {...props} />
    </HydrationSafeWrapper>
  );
};

export default SkillsEditor;
