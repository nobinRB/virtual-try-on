import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RAPID_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const image = formData.get('image');
    const clothImage = formData.get('clothImage');

    if (!image || !(image instanceof Blob) || !clothImage || !(clothImage instanceof Blob)) {
      return NextResponse.json(
        { error: 'Invalid image data' },
        { status: 400 }
      );
    }

    console.log('Processing virtual try-on...');

    const formDataToSend = new FormData();
    formDataToSend.append('clothing_image', clothImage);
    formDataToSend.append('avatar_image', image);

    const response = await fetch('https://try-on-diffusion.p.rapidapi.com/try-on-file', {
      method: 'POST',
      headers: {
        'x-rapidapi-key': process.env.RAPID_API_KEY!,
        'x-rapidapi-host': 'try-on-diffusion.p.rapidapi.com'
      },
      body: formDataToSend
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`RapidAPI request failed: ${errorText}`);
    }

    // Handle binary response
    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64Image}`;

    return NextResponse.json({
      url: dataUrl,
      success: true
    });

  } catch (error: unknown) {
    console.error('Error details:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process image' },
      { status: 500 }
    );
  }
}

// Helper function to convert Blob to Data URL
async function blobToDataURL(blob: Blob): Promise<string> {
  const buffer = Buffer.from(await blob.arrayBuffer());
  return `data:${blob.type};base64,${buffer.toString('base64')}`;
}