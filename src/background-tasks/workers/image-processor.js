const sharp = require('sharp');

module.exports = async (job) => {
  const { file, fileName } = job.data;
  const outputPath = `${__dirname}/../../../uploads/${fileName}`;
  // resize file size and image size to 600 px, loseless: true - to maintain quality
  await sharp(file.buffer).resize(600).webp({ quality: 80 }).toFile(outputPath);
};
