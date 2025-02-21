import ImageUploader from '../components/ImageUploader'
export default function Home() {
  return (
    <main className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Virtual Try-On
        </h1>
        <ImageUploader />
      </div>
    </main>
  )
}