import { FC,ChangeEvent, useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogoutMutation } from '../../redux/api/injected/authApi.ts';
import { useNavigate } from 'react-router-dom';
import {  fetchUserData, updateUserFullName } from '@/services/userServices';
import {markUserOffline}from '@/services/userPresenceService';
import {uploadAvatar}from '@/services/avatarServices';
import { auth } from '@/firebaseConfig';

const ProfileSheet: FC = () => {
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string | null>(null);
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await fetchUserData();
        setFullName(data.fullName);
        setAvatarPreview(data.avatarUrl);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    loadUserData();
  }, []);
  const handleLogout = async () => {
    try {
      markUserOffline();
      await logout().unwrap();

      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };
  const handleSaveChanges = async () => {
    const userId = auth.currentUser?.uid;

    // Update full name
    if (userId && fullName) {
      try {
        await updateUserFullName(userId, fullName);
        alert('Full name updated successfully!');
      } catch (error) {
        console.error('Full name update failed', error);
      }
    }

    // Upload avatar
    if (userId && selectedFile) {
      try {
        setIsUploading(true);
        await uploadAvatar(userId, selectedFile);
        alert('Avatar uploaded successfully!');
      } catch (error) {
        console.error('Avatar upload failed', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
      <Sheet>
        <SheetTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src={avatarPreview || 'https://github.com/shadcn.png'} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Full Name
              </Label>
              <Input
                  id="name"
                  value={fullName || ''}
                  onChange={(e) => setFullName(e.target.value)}
                  className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="avatar" className="text-right">
                Avatar
              </Label>
              <Input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="col-span-3"
              />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit" onClick={handleSaveChanges} disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Save changes'}
              </Button>
            </SheetClose>
            <Button variant="destructive" onClick={handleLogout}>
              Log Out
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
  );
};

export default ProfileSheet;