import { hash, compare } from 'bcryptjs';
import excelJS from 'exceljs';
import streamBuffers from 'stream-buffers';

class GlobalUtils {
  private readonly excelJS = excelJS;

  public hashData = async (data: string) => hash(data, 10);

  public compareHash = async (data: string, hash: string) =>
    compare(data, hash);

  public async writeToMemory(
    columns: Partial<excelJS.Column>[],
    datas: Record<string, any>[],
  ) {
    const writableStreamBuffer = new streamBuffers.WritableStreamBuffer({
      initialSize: 100 * 1024, // ukuran awal 100KB
      incrementAmount: 10 * 1024, // tambahkan 10KB saat buffer overflow
    });

    const workbook = new this.excelJS.stream.xlsx.WorkbookWriter({
      stream: writableStreamBuffer,
      useStyles: true,
      useSharedStrings: true,
    });

    const worksheet = workbook.addWorksheet('Sheet1');
    worksheet.columns = columns;
    for (const data of datas) worksheet.addRow(data).commit();

    worksheet.commit();

    await workbook.commit();
    return (writableStreamBuffer.getContents() || null) as Buffer | null;
  }
}

const globalUtils = new GlobalUtils();

export { globalUtils };
