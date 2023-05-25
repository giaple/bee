import { Button, IconButton, ImageList, ImageListItem, Stack } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Image from 'next/image';
import React, { useEffect } from 'react'
import { FilePresignedUrlModel, FileUploadInput, Mutation } from '@/dataStructure/categories';
import { gql, useMutation, useQuery } from '@apollo/client';
import { getFileType } from '@/utils/func';
import AddIcon from '@mui/icons-material/Add';

interface UploadImageProps {
    uploadAction: Function;
    target: String;
    uploadedImages: Array<Partial<FilePresignedUrlModel>>;
    isSingle?: boolean;
}

const UPLOAD_IMAGE = gql`
  mutation uploadImage($input: FileUploadInput! ) {
    uploadImage(input: $input) {
        url
        cdnUrl
        fields {
            acl
            algorithm
            bucket
            contentType
            credential
            date
            key
            signature
            policy
        }
    }
  }
`;

const uploadImageAWS = async (fileInfo : FilePresignedUrlModel, file: File) => {
    const formData = new FormData();
    formData.append("acl", fileInfo?.fields?.acl || '');
    formData.append("X-Amz-Algorithm", fileInfo.fields?.algorithm || '');
    formData.append("Content-Type", fileInfo.fields?.contentType || '');
    formData.append("X-Amz-Credential", fileInfo.fields?.credential || '');
    formData.append("X-Amz-Date", fileInfo.fields?.date || '');
    formData.append("key", fileInfo.fields?.key || '');
    formData.append("X-Amz-Signature", fileInfo.fields?.signature || '');
    formData.append("policy", fileInfo.fields?.policy || '');
    formData.append("file", file);
    try {
        await fetch(fileInfo?.url || '', {
            method: "POST",
            body: formData,
        });
        return true

    } catch (error) {
        return false
    }
    
}

const UploadImage = (props: UploadImageProps) => {

    const [uploading, setImg] = React.useState<File>()
    const [uploaded, setUploaded] = React.useState<Partial<FilePresignedUrlModel>[]>(props.uploadedImages)
    const [mutate, { loading, error, data }] = useMutation(UPLOAD_IMAGE, {
        onCompleted: async (data: Mutation) => {
            if(data.uploadImage && uploading) {
                const result = await uploadImageAWS(data.uploadImage, uploading)
                if(result) {
                    const newImages = props.isSingle ? [data.uploadImage] : [...uploaded, data.uploadImage]
                    props.uploadAction(newImages)
                    setUploaded(newImages)
                    setImg(undefined)
                }
            }
        }
    });

    const uploadImage = async () => {
        if (uploading) {
            const type = getFileType(uploading).toUpperCase();
            mutate({variables: {input : {target: props.target, type: type}}})
        }
    }

    const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            let img = e.target.files[0];

            // setImg(URL.createObjectURL(img));
            setImg(img)
        }
    }

    useEffect(() => {
        setUploaded(props.uploadedImages)
    }, [props.uploadedImages])

    return (
        <div style={{padding: '15px'}}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Button variant="outlined" size='large' component="label" style={{border: `1px dashed black`, width: '150px', height: '150px'}}>
                    {uploading ? <Image
                src={URL.createObjectURL(uploading)}
                width={150}
                height={150}
                alt="Picture of the author"
                /> : <>
                    <AddIcon />
                    <input hidden accept="image/*" multiple={false} type="file" onChange={onImageChange}/>
                </>}
                    
                </Button>
                <IconButton color="primary" aria-label="upload picture" component="label" onClick={uploadImage}>
                    <CloudUploadIcon />
                </IconButton>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2} marginTop={3}>
                {
                    uploaded?.length ? <ImageList sx={{ width: 500, height: props.isSingle ? 200 : 450 }} cols={props.isSingle ? 1 : 3} rowHeight={164}>
                        {uploaded.map((img) => (
                            <ImageListItem key={img.cdnUrl}>
                            <Image
                                            src={img?.cdnUrl || ''}
                                            width={150}
                                            height={150}
                                            alt="Picture of the author"
                                            key={img.cdnUrl}
                                        />
                            </ImageListItem>
                        ))}
                    </ImageList>  : null   
                }
                
            </Stack>
        </div>
        
    )
}

export default UploadImage