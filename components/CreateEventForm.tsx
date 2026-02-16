import React, { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../services/eventService';
import { apiService } from '../services/apiService';
import PhotoIcon from './icons/PhotoIcon';
import SendIcon from './icons/SendIcon';

const CreateEventForm: React.FC = () => {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [photoAlbumUrl, setPhotoAlbumUrl] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [invitees, setInvitees] = useState<string[]>([]);
  const [phoneInvitees, setPhoneInvitees] = useState<{ phone: string; method: 'sms' | 'whatsapp' }[]>([]);
  const [currentInvitee, setCurrentInvitee] = useState('');
  const [currentPhone, setCurrentPhone] = useState('');
  const [phoneMethod, setPhoneMethod] = useState<'sms' | 'whatsapp'>('sms');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const navigate = useNavigate();

  const handleAddInvitee = () => {
    if (currentInvitee && !invitees.includes(currentInvitee) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentInvitee)) {
      setInvitees([...invitees, currentInvitee]);
      setCurrentInvitee('');
    }
  };

  const handleRemoveInvitee = (emailToRemove: string) => {
    setInvitees(invitees.filter(email => email !== emailToRemove));
  };

  const handleAddPhoneInvitee = () => {
    if (currentPhone && /^[\+]?[1-9]\d{1,14}$/.test(currentPhone.replace(/\s/g, ''))) {
      const newInvitee = { phone: currentPhone, method: phoneMethod };
      setPhoneInvitees([...phoneInvitees, newInvitee]);
      setCurrentPhone('');
    }
  };

  const handleRemovePhoneInvitee = (index: number) => {
    setPhoneInvitees(phoneInvitees.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size must be less than 10MB');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const result = await apiService.uploadImage(file);
      setUploadedImage(result.imageUrl);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    const filename = uploadedImage.split('/').pop();
    if (filename) {
      try {
        await apiService.deleteImage(filename);
        setUploadedImage('');
      } catch (error) {
        setUploadError('Failed to delete image');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !datetime || !location) return;
    const newEvent = createEvent({ name, datetime, location, description, photoAlbumUrl, imageUrl: uploadedImage }, invitees);
    sessionStorage.setItem(`phoneInvitees_${newEvent.id}`, JSON.stringify(phoneInvitees));
    navigate(`/dashboard/${newEvent.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Create a New Event</h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Event Name</label>
          <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-slate-200" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="datetime" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Date & Time</label>
            <input type="datetime-local" id="datetime" value={datetime} onChange={e => setDatetime(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-slate-200" />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Location</label>
            <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-slate-200" />
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
          <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-slate-200"></textarea>
        </div>
        <div>
          <label htmlFor="photoAlbumUrl" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Shared Photo Album URL (Optional)</label>
          <input type="url" id="photoAlbumUrl" value={photoAlbumUrl} onChange={e => setPhotoAlbumUrl(e.target.value)} placeholder="https://photos.app.goo.gl/..." className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-slate-200" />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Event Photo</label>
          <div className="flex items-center justify-center gap-4">
            <input type="file" id="photo" onChange={handleImageUpload} disabled={uploading} accept="image/*" className="hidden" />
            <label htmlFor="photo" className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 cursor-pointer hover:border-indigo-500 transition ${uploading ? 'opacity-50' : ''}`}>
              <PhotoIcon className="w-5 h-5" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{uploading ? 'Uploading...' : 'Choose Image'}</span>
            </label>
            {uploadedImage && (
              <div className="flex items-center gap-2">
                <img src={uploadedImage} alt="Uploaded" className="w-12 h-12 rounded object-cover" loading="lazy" />
                <button type="button" onClick={handleRemoveImage} className="text-red-500 hover:text-red-700 font-bold">✕</button>
              </div>
            )}
          </div>
          {uploadError && <p className="mt-2 text-sm text-red-500">{uploadError}</p>}
        </div>

        <div>
          <label htmlFor="invitees" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Invitees</label>
          <div className="flex mt-1">
            <input type="email" id="invitees" value={currentInvitee} onChange={e => setCurrentInvitee(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInvitee())} placeholder="invitee@example.com" className="flex-grow px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-slate-200" />
            <button type="button" onClick={handleAddInvitee} className="bg-indigo-500 text-white font-semibold px-4 py-2 rounded-r-md hover:bg-indigo-600 transition">Add</button>
          </div>
          <ul className="mt-2 space-y-1">
            {invitees.map(email => (
              <li key={email} className="flex justify-between items-center bg-slate-100 dark:bg-slate-700 p-2 rounded">
                <span className="text-sm text-slate-600 dark:text-slate-300">{email}</span>
                <button type="button" onClick={() => handleRemoveInvitee(email)} className="text-red-500 hover:text-red-700 font-bold">✕</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Phone Invitees */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">SMS/WhatsApp Invitees</label>
          <div className="flex gap-2 mt-1">
            <input type="tel" value={currentPhone} onChange={e => setCurrentPhone(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPhoneInvitee())} placeholder="+1234567890" className="flex-grow px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-slate-200" />
            <select value={phoneMethod} onChange={(e) => setPhoneMethod(e.target.value as 'sms' | 'whatsapp')} className="px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-none shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-slate-200">
              <option value="sms">SMS</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
            <button type="button" onClick={handleAddPhoneInvitee} className="bg-green-500 text-white font-semibold px-4 py-2 rounded-r-md hover:bg-green-600 transition">Add</button>
          </div>
          <ul className="mt-2 space-y-1">
            {phoneInvitees.map((invitee, index) => (
              <li key={index} className="flex justify-between items-center bg-green-50 dark:bg-slate-700 p-2 rounded">
                <span className="text-sm text-slate-600 dark:text-slate-300">{invitee.phone} <span className="text-xs bg-green-200 dark:bg-green-900 px-2 py-1 rounded ml-2">{invitee.method === 'whatsapp' ? '📱 WhatsApp' : '💬 SMS'}</span></span>
                <button type="button" onClick={() => handleRemovePhoneInvitee(index)} className="text-red-500 hover:text-red-700 font-bold">✕</button>
              </li>
            ))}
          </ul>
        </div>

        <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 flex items-center justify-center gap-2">
          <SendIcon className="w-5 h-5" />
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEventForm;