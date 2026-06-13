import React, { useState, useMemo } from 'react';
import { Select, Row, Col, Spin } from 'antd';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { MapPin, Users, Activity } from 'lucide-react';

const STATUS_CFG = [
  { key: 'pending', label: 'Chờ tiếp nhận', color: '#fa8c16', bg: '#fff7e6' },
  { key: 'inProgress', label: 'Đang xử lý', color: '#1677ff', bg: '#e6f4ff' },
  { key: 'resolved', label: 'Đã giải quyết', color: '#52c41a', bg: '#f6ffed' },
  { key: 'rejected', label: 'Từ chối', color: '#ff4d4f', bg: '#fff2f0' },
];

const DEMO_CFG = [
  { key: 'rescuedElderly', label: 'Người già', color: '#6366f1' },
  { key: 'rescuedWomen', label: 'Phụ nữ', color: '#ec4899' },
  { key: 'rescuedChildren', label: 'Trẻ em', color: '#f59e0b' },
  { key: 'rescuedOthers', label: 'Khác', color: '#14b8a6' },
];

const PIE_COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#14b8a6'];
const RADIAN = Math.PI / 180;

const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(99,102,241,0.3)',
      borderRadius: 12, padding: '12px 16px', color: '#fff',
      backdropFilter: 'blur(8px)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
    }}>
      <p style={{ fontWeight: 700, marginBottom: 6, color: '#a5b4fc', fontSize: 13 }}>{label}</p>
      {payload.map(e => (
        <p key={e.name} style={{ margin: '2px 0', fontSize: 12 }}>
          <span style={{
            display: 'inline-block', width: 10, height: 10,
            borderRadius: 2, background: e.fill || e.color, marginRight: 6
          }} />
          {e.name}: <strong>{e.value}</strong>
        </p>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div style={{
      background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(99,102,241,0.3)',
      borderRadius: 12, padding: '12px 16px', color: '#fff',
      backdropFilter: 'blur(8px)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
    }}>
      <p style={{ fontWeight: 700, color: item.payload.fill, margin: 0, fontSize: 13 }}>{item.name}</p>
      <p style={{ margin: '4px 0 0', fontSize: 12 }}>Số người: <strong>{item.value}</strong></p>
    </div>
  );
};

const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.04) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  return (
    <text
      x={cx + r * Math.cos(-midAngle * RADIAN)}
      y={cy + r * Math.sin(-midAngle * RADIAN)}
      fill="white" textAnchor="middle" dominantBaseline="central"
      fontSize={11} fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const ProvinceStatistics = ({ statsData = [], loading = false, allProvinces = [] }) => {
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const provinceData = useMemo(
    () => statsData.find(d => d.province === selectedProvince) || null,
    [statsData, selectedProvince]
  );

  const districts = useMemo(() => provinceData?.districts || [], [provinceData]);

  const activeData = useMemo(() => {
    if (!provinceData) return null;
    if (selectedDistrict) return districts.find(d => d.district === selectedDistrict) || null;
    return provinceData;
  }, [provinceData, districts, selectedDistrict]);

  const barData = STATUS_CFG.map(s => ({
    name: s.label, value: activeData?.[s.key] ?? 0, fill: s.color
  }));

  const pieData = DEMO_CFG
    .map((c, i) => ({ name: c.label, value: activeData?.[c.key] ?? 0, fill: PIE_COLORS[i] }))
    .filter(x => x.value > 0);

  const totalRescued = DEMO_CFG.reduce((sum, c) => sum + (activeData?.[c.key] ?? 0), 0);

  const locationLabel = selectedDistrict
    ? `${selectedDistrict} — ${selectedProvince}`
    : selectedProvince || '';

  const handleProvinceChange = (val) => {
    setSelectedProvince(val ?? null);
    setSelectedDistrict(null);
  };

  const provinceList = allProvinces.length > 0
    ? allProvinces
    : statsData.map(d => d.province);

  return (
    <div style={{ padding: '0 4px' }}>

      <div style={{
        background: '#172554',
        borderRadius: 16, padding: '16px 20px', marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
        border: '1px solid rgba(30, 58, 138, 0.5)'
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <MapPin size={18} color="#fff" />
        </div>

        <div>
          <p style={{ margin: '0 0 3px', color: '#94a3b8', fontSize: 11 }}>Tỉnh / Thành phố</p>
          <Select
            showSearch optionFilterProp="children"
            style={{ width: 260 }}
            placeholder="Chọn tỉnh / thành phố..."
            allowClear value={selectedProvince}
            onChange={handleProvinceChange}
            size="middle"
          >
            {provinceList.map(p => (
              <Select.Option key={p} value={p}>
                {p}
                {!statsData.find(d => d.province === p) && (
                  <span style={{ color: '#94a3b8', fontSize: 10, marginLeft: 6 }}>(chưa có dữ liệu)</span>
                )}
              </Select.Option>
            ))}
          </Select>
        </div>

        {provinceData && districts.length > 0 && (
          <div>
            <p style={{ margin: '0 0 3px', color: '#94a3b8', fontSize: 11 }}>Phường / Quận</p>
            <Select
              showSearch optionFilterProp="children"
              style={{ width: 260 }}
              placeholder="Chọn Phường/ Quận"
              allowClear value={selectedDistrict}
              onChange={val => setSelectedDistrict(val ?? null)}
              size="middle"
            >
              {districts.map(d => (
                <Select.Option key={d.district} value={d.district}>
                  {d.district}
                </Select.Option>
              ))}
            </Select>
          </div>
        )}

        {activeData && (
          <div style={{ display: 'flex', gap: 20, flexShrink: 0 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#94a3b8', fontSize: 10 }}>Tổng yêu cầu</div>
              <div style={{ color: '#fff', fontSize: 22, fontWeight: 800 }}>{activeData.total}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#94a3b8', fontSize: 10 }}>Đã cứu</div>
              <div style={{ color: '#4ade80', fontSize: 22, fontWeight: 800 }}>{totalRescued}</div>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
      )}

      {!loading && !selectedProvince && (
        <div style={{
          background: 'linear-gradient(135deg, #f8faff, #eef2ff)',
          borderRadius: 16, padding: 60, textAlign: 'center',
          border: '2px dashed #c7d2fe'
        }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🗺️</div>
          <p style={{ color: '#6366f1', fontWeight: 600, fontSize: 16, margin: 0 }}>
            Vui lòng chọn một tỉnh để hiển thị biểu đồ
          </p>
          <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>
            Danh sách gồm <strong>{provinceList.length}</strong> tỉnh / thành phố
          </p>
        </div>
      )}

      {!loading && selectedProvince && !provinceData && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: 300, background: 'linear-gradient(135deg, #f8faff, #eef2ff)',
          borderRadius: 16, border: '2px dashed #c7d2fe'
        }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>📭</div>
          <p style={{ color: '#6366f1', fontWeight: 600, fontSize: 15, margin: 0 }}>
            {selectedProvince} chưa có yêu cầu cứu hộ
          </p>
          <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>
            Dữ liệu sẽ hiện khi có yêu cầu được ghi nhận tại tỉnh này
          </p>
        </div>
      )}

      {!loading && selectedProvince && provinceData && (
        <>
          {selectedDistrict && (
            <div style={{
              background: '#f0f9ff', borderRadius: 10, padding: '8px 14px',
              marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
              border: '1px solid #bae6fd', fontSize: 13, color: '#0369a1'
            }}>
              <strong>{selectedDistrict}</strong>
              <span style={{ color: '#64748b' }}>— {selectedProvince}</span>
              <span
                style={{ marginLeft: 'auto', cursor: 'pointer', color: '#6366f1', fontSize: 12 }}
                onClick={() => setSelectedDistrict(null)}
              >
                ← Xem toàn tỉnh
              </span>
            </div>
          )}

          <Row gutter={[20, 20]}>

            <Col xs={24} xl={13}>
              <div style={{
                background: '#fff', borderRadius: 16, padding: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'linear-gradient(135deg, #1677ff, #0ea5e9)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Activity size={18} color="#fff" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 'normal', color: '#0f172a' }}>
                      Thống kê yêu cầu cứu hộ
                    </h3>
                    <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>{locationLabel}</p>
                  </div>
                </div>

                <Row gutter={8} style={{ marginBottom: 20 }}>
                  {STATUS_CFG.map(s => (
                    <Col span={6} key={s.key}>
                      <div style={{
                        background: s.bg, borderRadius: 10, padding: '10px 8px',
                        textAlign: 'center', border: `1px solid ${s.color}22`
                      }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>
                          {activeData?.[s.key] ?? 0}
                        </div>
                        <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.3, marginTop: 2 }}>
                          {s.label}
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>

                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={barData} barSize={42} barCategoryGap="30%"
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)', radius: 6 }} />
                    <Bar dataKey="value" name="Số lượng" radius={[6, 6, 0, 0]}>
                      {barData.map((e, i) => <Cell key={`b${i}`} fill={e.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>


              </div>
            </Col>

            <Col xs={24} xl={11}>
              <div style={{
                background: '#fff', borderRadius: 16, padding: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Users size={18} color="#fff" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 'normal', color: '#0f172a' }}>
                      Nạn nhân đã được cứu
                    </h3>
                    <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>{locationLabel}</p>
                  </div>
                </div>

                <Row gutter={8} style={{ marginBottom: 16 }}>
                  {DEMO_CFG.map(c => (
                    <Col span={6} key={c.key}>
                      <div style={{
                        background: `${c.color}0d`, borderRadius: 10, padding: '10px 4px',
                        textAlign: 'center', border: `1px solid ${c.color}22`
                      }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: c.color }}>
                          {activeData?.[c.key] ?? 0}
                        </div>
                        <div style={{ fontSize: 9, color: '#64748b', marginTop: 2, lineHeight: 1.3 }}>
                          {c.label}
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>

                {totalRescued === 0 ? (
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', height: 200, background: '#f8fafc',
                    borderRadius: 12, border: '1px dashed #e2e8f0'
                  }}>
                    <div style={{ fontSize: 40 }}>📭</div>
                    <p style={{ color: '#94a3b8', fontSize: 13, margin: '8px 0 0' }}>
                      Chưa có dữ liệu người được cứu
                    </p>
                    <p style={{ color: '#cbd5e1', fontSize: 11 }}>
                      Từ các yêu cầu "Đã giải quyết"
                    </p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={210}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%"
                        labelLine={false} label={PieLabel}
                        outerRadius={90} innerRadius={36}
                        dataKey="value" strokeWidth={2}
                      >
                        {pieData.map((e, i) => (
                          <Cell key={`p${i}`} fill={e.fill} stroke="#fff" />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                      <Legend iconType="circle" iconSize={10}
                        formatter={v => <span style={{ color: '#374151', fontSize: 12 }}>{v}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                )}

                <div style={{
                  marginTop: 12, background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                  borderRadius: 10, padding: '10px 14px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  border: '1px solid #86efac'
                }}>
                  <span style={{ color: '#166534', fontSize: 13, fontWeight: 600 }}>
                    Tổng số người được cứu
                  </span>
                  <span style={{ color: '#15803d', fontSize: 22, fontWeight: 800 }}>
                    {totalRescued} người
                  </span>
                </div>


              </div>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default ProvinceStatistics;
