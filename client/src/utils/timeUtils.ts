/**
 * Chuyển đổi định dạng thời gian "7h30" hoặc "14h45" thành số thập phân (7.5, 14.75)
 */
export const parseTimeToNumber = (timeStr: string): number => {
  const cleanStr = timeStr.trim().toLowerCase();
  const [hours, minutes] = cleanStr.split('h').map(Number);
  return hours + (minutes || 0) / 60;
};

/**
 * Chuyển đổi một range thời gian (7h30 - 9h00) thành đối tượng chứa start/end kiểu số
 */
export const parseTimeRange = (timeRangeStr: string) => {
  const [startStr, endStr] = timeRangeStr.split('-').map(s => s.trim());
  return {
    start: parseTimeToNumber(startStr),
    end: parseTimeToNumber(endStr)
  };
};

/**
 * Kiểm tra xem hai khung thời gian có bị chồng lấn (overlap) hay không
 */
export const isTimeOverlapping = (rangeA: string, rangeB: string) => {
  const a = parseTimeRange(rangeA);
  const b = parseTimeRange(rangeB);
  return a.start < b.end && a.end > b.start;
};

/**
 * Thuật toán phát hiện xung đột lịch giảng dạy cho một danh sách các ca học
 */
export const detectConflicts = <T extends { time: string, teacher_id?: string }>(sessions: T[]) => {
  const sessionsWithConflict = sessions.map(s => ({ ...s, isConflict: false }));
  
  for (let i = 0; i < sessionsWithConflict.length; i++) {
    for (let j = i + 1; j < sessionsWithConflict.length; j++) {
      const s1 = sessionsWithConflict[i];
      const s2 = sessionsWithConflict[j];
      
      // Nếu cùng giáo viên và thời gian chồng lấn
      if (s1.teacher_id && s1.teacher_id === s2.teacher_id) {
        if (isTimeOverlapping(s1.time, s2.time)) {
          s1.isConflict = true;
          s2.isConflict = true;
        }
      }
    }
  }
  
  return sessionsWithConflict;
};

/**
 * Thuật toán tính toán "Tầng" (Tracks) cho các ca học để tránh va chạm (Overlap)
 * Trả về danh sách session kèm theo thuộc tính layerIndex
 */
export const getScheduleLayers = <T extends { time: string }>(sessions: T[]) => {
  if (!sessions.length) return [];

  // 1. Sắp xếp: Thời gian bắt đầu sớm hơn lên trước, nếu cùng giờ thì ca dài hơn lên trước
  const sortedSessions = [...sessions].sort((a, b) => {
    const rangeA = parseTimeRange(a.time);
    const rangeB = parseTimeRange(b.time);
    
    if (rangeA.start !== rangeB.start) return rangeA.start - rangeB.start;
    return (rangeB.end - rangeB.start) - (rangeA.end - rangeA.start);
  });

  const tracks: number[] = []; // Lưu 'thời điểm kết thúc' của ca học cuối cùng trong mỗi track
  const positionedSessions = sortedSessions.map(session => {
    const { start, end } = parseTimeRange(session.time);
    
    // 2. Tìm track đầu tiên mà ca này có thể nhảy vào (start >= end cũ của track đó)
    let assignedLayer = -1;
    for (let i = 0; i < tracks.length; i++) {
      if (start >= tracks[i]) {
        assignedLayer = i;
        tracks[i] = end;
        break;
      }
    }

    // 3. Nếu không tìm thấy track trống, tạo track mới
    if (assignedLayer === -1) {
      assignedLayer = tracks.length;
      tracks.push(end);
    }

    return {
      ...session,
      layerIndex: assignedLayer
    };
  });

  return positionedSessions;
};

/**
 * Tính toán vị trí left và width cho thẻ lịch học trên trục Timeline
 */
export const calculateTimelinePosition = (
  timeRangeStr: string,
  timelineStart: number = 7,  // Timeline bắt đầu từ 7:00
  timelineEnd: number = 21    // Timeline kết thúc lúc 21:00
) => {
  const { start, end } = parseTimeRange(timeRangeStr);
  const totalDuration = timelineEnd - timelineStart;

  // Tính toán %
  const left = ((start - timelineStart) / totalDuration) * 100;
  const width = ((end - start) / totalDuration) * 100;

  return {
    left: `${Math.max(0, left)}%`,
    width: `${Math.max(2, width)}%`, // Đảm bảo thẻ tối thiểu 2% chiều rộng để dễ nhìn
  };
};

/**
 * Tạo danh sách các điểm thời gian để hiển thị thanh thước đo (Ruler)
 */
export const generateTimeRuler = (start: number = 7, end: number = 21) => {
  const ruler = [];
  for (let i = start; i <= end; i++) {
    ruler.push(`${i}:00`);
  }
  return ruler;
};
