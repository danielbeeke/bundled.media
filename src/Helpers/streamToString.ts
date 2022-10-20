export const streamToString = async (stream: any): Promise<string> => {
  stream.on('error', (error: any) => {
      console.error(error)
  })

  const decoder = new TextDecoder()
  const chunks = []
  for await (const chunk of stream) {
      chunks.push(typeof chunk === 'string' ? chunk : decoder.decode(chunk))
  }

  return chunks.join('')
}

// its probably  not in the handling.
// import toString from 'npm:stream-to-string'
// console.log(toString)
// export const streamToString = toString