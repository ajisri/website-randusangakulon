import React, { useState } from "react";
import useSWR from "swr"; // Import SWR
import { TabView, TabPanel } from "primereact/tabview";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// reactstrap components
import { Button, Row, Col } from "reactstrap";

import "primereact/resources/themes/saga-blue/theme.css"; // Import tema
import "primereact/resources/primereact.min.css"; // Import CSS utama PrimeReact

const fetcher = (url) => fetch(url).then((res) => res.json());

const Modalt = () => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogVisiblePH, setDialogVisiblePH] = useState(false);

  const { data: produkhukumData, error: produkhukumError } = useSWR(
    "http://localhost:5000/produk_hukum",
    fetcher
  );

  const loadingProdukhukum = !produkhukumData && !produkhukumError;

  const dialogFooterTemplate = () => {
    return (
      <Button
        label="Ok"
        icon="pi pi-check"
        onClick={() => setDialogVisible(false)}
      />
    );
  };

  const dialogFooterTemplatePH = () => {
    return (
      <Button
        label="Ok"
        icon="pi pi-check"
        onClick={() => setDialogVisiblePH(false)}
      />
    );
  };

  const showDialog = () => {
    setDialogVisible(true);
  };

  const showDialogPH = () => {
    setDialogVisiblePH(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  const hideDialogPH = () => {
    setDialogVisiblePH(false);
  };

  const tab1HeaderTemplate = (options) => (
    <div
      className="flex align-items-center gap-2 p-3"
      style={{ cursor: "pointer" }}
      onClick={options.onClick}
    >
      <i className="ni ni-paper-diploma"></i>
      <span className="font-bold white-space-nowrap">Tata Laksana</span>
    </div>
  );

  const tab2HeaderTemplate = (options) => (
    <div
      className="flex align-items-center gap-2 p-3"
      style={{ cursor: "pointer" }}
      onClick={options.onClick}
    >
      <i className="ni ni-tv-2"></i>
      <span className="font-bold white-space-nowrap">Pengawasan</span>
    </div>
  );

  const tab3HeaderTemplate = (options) => (
    <div
      className="flex align-items-center gap-2 p-3"
      style={{ cursor: "pointer" }}
      onClick={options.onClick}
    >
      <i className="ni ni-building"></i>
      <span className="font-bold white-space-nowrap">Kualitas Layanan</span>
      {/* <Badge value="2" /> */}
    </div>
  );

  const tab4HeaderTemplate = (options) => (
    <div
      className="flex align-items-center gap-2 p-3"
      style={{ cursor: "pointer" }}
      onClick={options.onClick}
    >
      <i className="ni ni-user-run"></i>
      <span className="font-bold white-space-nowrap">Partisipasi</span>
    </div>
  );

  const tab5HeaderTemplate = (options) => (
    <div
      className="flex align-items-center gap-2 p-3"
      style={{ cursor: "pointer" }}
      onClick={options.onClick}
    >
      <i className="ni ni-badge"></i>
      <span className="font-bold white-space-nowrap">Kearifan Lokal</span>
    </div>
  );

  return (
    <>
      <h2 className="mt-sm mb-2">
        <span></span>
      </h2>
      <Row>
        <Col className="mt-1" md="3" xs="6">
          <Button
            block
            className="btn-white btn-icon mb-3 mb-sm-0 video-button"
            color="default"
            type="button"
            icon="pi pi-external-link"
            onClick={showDialog}
          >
            Desa Ankor
          </Button>
          <div className="card">
            <Dialog
              header="Desa Ankor"
              visible={dialogVisible}
              style={{ width: "75vw" }}
              maximizable
              modal
              contentStyle={{ height: "300px" }}
              onHide={hideDialog}
              footer={dialogFooterTemplate}
            >
              <TabView>
                <TabPanel header="Header I" headerTemplate={tab1HeaderTemplate}>
                  <Accordion activeIndex={0}>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keberadaan Perdes Tentang Perencanaan, Pelaksanaan,
                            Penatausahaan, dan Pertanggungjawaban APBDes
                          </span>
                          {/* <Badge value="3" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum.
                      </p>
                    </AccordionTab>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/onyamalimba.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keberadaan SOP Mengenai Mekanisme Pengawasan dan
                            Evaluasi Kinerja Perangkat Desa
                          </span>
                          {/* <Badge value="4" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        Sed ut perspiciatis unde omnis iste natus error sit
                        voluptatem accusantium doloremque laudantium, totam rem
                        aperiam, eaque ipsa quae ab illo inventore veritatis et
                        quasi architecto beatae vitae dicta sunt explicabo. Nemo
                        enim ipsam voluptatem quia voluptas sit aspernatur aut
                        odit aut fugit, sed quia consequuntur magni dolores eos
                        qui ratione voluptatem sequi nesciunt. Consectetur,
                        adipisci velit, sed quia non numquam eius modi.
                      </p>
                    </AccordionTab>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keberadaan Perdes/Keputusan Kepala Desa Tentang
                            Pengendalian Penerimaan Gratifikasi, Suap, dan
                            Konflik Kepentingan
                          </span>
                          {/* <Badge value="2" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos
                        ducimus qui blanditiis praesentium voluptatum deleniti
                        atque corrupti quos dolores et quas molestias excepturi
                        sint occaecati cupiditate non provident, similique sunt
                        in culpa qui officia deserunt mollitia animi, id est
                        laborum et dolorum fuga. Et harum quidem rerum facilis
                        est et expedita distinctio. Nam libero tempore, cum
                        soluta nobis est eligendi optio cumque nihil impedit quo
                        minus.
                      </p>
                    </AccordionTab>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keberadaan Perjanjian Kerjasama Antara Pelaksana
                            Kegiatan Anggaran dengan Pihak Penyedia dan Telah
                            Melalui Proses PBJ di Desa
                          </span>
                          {/* <Badge value="2" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos
                        ducimus qui blanditiis praesentium voluptatum deleniti
                        atque corrupti quos dolores et quas molestias excepturi
                        sint occaecati cupiditate non provident, similique sunt
                        in culpa qui officia deserunt mollitia animi, id est
                        laborum et dolorum fuga. Et harum quidem rerum facilis
                        est et expedita distinctio. Nam libero tempore, cum
                        soluta nobis est eligendi optio cumque nihil impedit quo
                        minus.
                      </p>
                    </AccordionTab>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keberadaan Perdes/Keputusan Kepala Desa/SOP Tentang
                            Pakta Integritas dan Sejenisnya
                          </span>
                          {/* <Badge value="2" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos
                        ducimus qui blanditiis praesentium voluptatum deleniti
                        atque corrupti quos dolores et quas molestias excepturi
                        sint occaecati cupiditate non provident, similique sunt
                        in culpa qui officia deserunt mollitia animi, id est
                        laborum et dolorum fuga. Et harum quidem rerum facilis
                        est et expedita distinctio. Nam libero tempore, cum
                        soluta nobis est eligendi optio cumque nihil impedit quo
                        minus.
                      </p>
                    </AccordionTab>
                  </Accordion>
                </TabPanel>
                <TabPanel
                  headerTemplate={tab2HeaderTemplate}
                  headerClassName="flex align-items-center"
                >
                  <Accordion activeIndex={0}>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keberadaan Kegiatan Pengawasan dan Evaluasi Kinerja
                            Perangkat Desa
                          </span>
                          {/* <Badge value="2" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos
                        ducimus qui blanditiis praesentium voluptatum deleniti
                        atque corrupti quos dolores et quas molestias excepturi
                        sint occaecati cupiditate non provident, similique sunt
                        in culpa qui officia deserunt mollitia animi, id est
                        laborum et dolorum fuga. Et harum quidem rerum facilis
                        est et expedita distinctio. Nam libero tempore, cum
                        soluta nobis est eligendi optio cumque nihil impedit quo
                        minus.
                      </p>
                    </AccordionTab>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keberadaan Tindak Lanjut Pembinaan, Petunjuk,
                            Arahan, Pengawasan, dan Pemeriksaan Dari Pemerintah
                            Pusat/Daerah
                          </span>
                          {/* <Badge value="2" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos
                        ducimus qui blanditiis praesentium voluptatum deleniti
                        atque corrupti quos dolores et quas molestias excepturi
                        sint occaecati cupiditate non provident, similique sunt
                        in culpa qui officia deserunt mollitia animi, id est
                        laborum et dolorum fuga. Et harum quidem rerum facilis
                        est et expedita distinctio. Nam libero tempore, cum
                        soluta nobis est eligendi optio cumque nihil impedit quo
                        minus.
                      </p>
                    </AccordionTab>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Tidak adanya Aparatur Desa yang Terjerat Tindak
                            Kriminal Dalam 3 (Tiga) Tahun Terakhir
                          </span>
                          {/* <Badge value="2" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos
                        ducimus qui blanditiis praesentium voluptatum deleniti
                        atque corrupti quos dolores et quas molestias excepturi
                        sint occaecati cupiditate non provident, similique sunt
                        in culpa qui officia deserunt mollitia animi, id est
                        laborum et dolorum fuga. Et harum quidem rerum facilis
                        est et expedita distinctio. Nam libero tempore, cum
                        soluta nobis est eligendi optio cumque nihil impedit quo
                        minus.
                      </p>
                    </AccordionTab>
                  </Accordion>
                </TabPanel>
                <TabPanel
                  headerTemplate={tab3HeaderTemplate}
                  headerClassName="flex align-items-center"
                >
                  <Accordion activeIndex={0}>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keberadaan Layanan Pengaduan Bagi Masyarakat
                          </span>
                          {/* <Badge value="3" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum.
                      </p>
                    </AccordionTab>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/onyamalimba.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keberadaan Survei Kepuasan Masyarakat Terhadap
                            Layanan Pemerintah Desa
                          </span>
                          {/* <Badge value="4" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        Sed ut perspiciatis unde omnis iste natus error sit
                        voluptatem accusantium doloremque laudantium, totam rem
                        aperiam, eaque ipsa quae ab illo inventore veritatis et
                        quasi architecto beatae vitae dicta sunt explicabo. Nemo
                        enim ipsam voluptatem quia voluptas sit aspernatur aut
                        odit aut fugit, sed quia consequuntur magni dolores eos
                        qui ratione voluptatem sequi nesciunt. Consectetur,
                        adipisci velit, sed quia non numquam eius modi.
                      </p>
                    </AccordionTab>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keterbukaan dan Akses Masyarakat Desa Terhadap
                            Informasi Standar Pelayanan Minimal
                          </span>
                          {/* <Badge value="2" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos
                        ducimus qui blanditiis praesentium voluptatum deleniti
                        atque corrupti quos dolores et quas molestias excepturi
                        sint occaecati cupiditate non provident, similique sunt
                        in culpa qui officia deserunt mollitia animi, id est
                        laborum et dolorum fuga. Et harum quidem rerum facilis
                        est et expedita distinctio. Nam libero tempore, cum
                        soluta nobis est eligendi optio cumque nihil impedit quo
                        minus.
                      </p>
                    </AccordionTab>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keberadaan Media Informasi Tentang Apbdes di Balai
                            Desa dan atau Tempat Lain yang Mudah di Akses Warga
                          </span>
                          {/* <Badge value="2" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos
                        ducimus qui blanditiis praesentium voluptatum deleniti
                        atque corrupti quos dolores et quas molestias excepturi
                        sint occaecati cupiditate non provident, similique sunt
                        in culpa qui officia deserunt mollitia animi, id est
                        laborum et dolorum fuga. Et harum quidem rerum facilis
                        est et expedita distinctio. Nam libero tempore, cum
                        soluta nobis est eligendi optio cumque nihil impedit quo
                        minus.
                      </p>
                    </AccordionTab>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keberadaan Maklumat Pelayanan
                          </span>
                          {/* <Badge value="2" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos
                        ducimus qui blanditiis praesentium voluptatum deleniti
                        atque corrupti quos dolores et quas molestias excepturi
                        sint occaecati cupiditate non provident, similique sunt
                        in culpa qui officia deserunt mollitia animi, id est
                        laborum et dolorum fuga. Et harum quidem rerum facilis
                        est et expedita distinctio. Nam libero tempore, cum
                        soluta nobis est eligendi optio cumque nihil impedit quo
                        minus.
                      </p>
                    </AccordionTab>
                  </Accordion>
                </TabPanel>
                <TabPanel
                  headerTemplate={tab4HeaderTemplate}
                  headerClassName="flex align-items-center"
                >
                  <Accordion activeIndex={0}>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/onyamalimba.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keberadaan Survei Kepuasan Masyarakat Terhadap
                            Layanan Pemerintah Desa
                          </span>
                          {/* <Badge value="4" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        Sed ut perspiciatis unde omnis iste natus error sit
                        voluptatem accusantium doloremque laudantium, totam rem
                        aperiam, eaque ipsa quae ab illo inventore veritatis et
                        quasi architecto beatae vitae dicta sunt explicabo. Nemo
                        enim ipsam voluptatem quia voluptas sit aspernatur aut
                        odit aut fugit, sed quia consequuntur magni dolores eos
                        qui ratione voluptatem sequi nesciunt. Consectetur,
                        adipisci velit, sed quia non numquam eius modi.
                      </p>
                    </AccordionTab>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Kesadaran Masyarakat Dalam Mencegah Terjadinya
                            Praktik Gratifikasi Suap dan Konflik Kepentingan
                          </span>
                          {/* <Badge value="2" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos
                        ducimus qui blanditiis praesentium voluptatum deleniti
                        atque corrupti quos dolores et quas molestias excepturi
                        sint occaecati cupiditate non provident, similique sunt
                        in culpa qui officia deserunt mollitia animi, id est
                        laborum et dolorum fuga. Et harum quidem rerum facilis
                        est et expedita distinctio. Nam libero tempore, cum
                        soluta nobis est eligendi optio cumque nihil impedit quo
                        minus.
                      </p>
                    </AccordionTab>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keterlibatan Lembaga Kemasyarakatan Desa dan
                            Masyarakat Dalam Pelaksanaan Pembangunan Desa
                          </span>
                          {/* <Badge value="2" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos
                        ducimus qui blanditiis praesentium voluptatum deleniti
                        atque corrupti quos dolores et quas molestias excepturi
                        sint occaecati cupiditate non provident, similique sunt
                        in culpa qui officia deserunt mollitia animi, id est
                        laborum et dolorum fuga. Et harum quidem rerum facilis
                        est et expedita distinctio. Nam libero tempore, cum
                        soluta nobis est eligendi optio cumque nihil impedit quo
                        minus.
                      </p>
                    </AccordionTab>
                  </Accordion>
                </TabPanel>
                <TabPanel
                  headerTemplate={tab5HeaderTemplate}
                  headerClassName="flex align-items-center"
                >
                  <Accordion activeIndex={0}>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keberadaan Budaya Lokal/Hukum Adat Yang Mendorong
                            Upaya Pencegahan Tindak Pidana Korupsi\
                          </span>
                          {/* <Badge value="2" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos
                        ducimus qui blanditiis praesentium voluptatum deleniti
                        atque corrupti quos dolores et quas molestias excepturi
                        sint occaecati cupiditate non provident, similique sunt
                        in culpa qui officia deserunt mollitia animi, id est
                        laborum et dolorum fuga. Et harum quidem rerum facilis
                        est et expedita distinctio. Nam libero tempore, cum
                        soluta nobis est eligendi optio cumque nihil impedit quo
                        minus.
                      </p>
                    </AccordionTab>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keberadaan Tokoh Masyarakat, Agama, Adat, Pemuda,
                            Kaum Perempuan yang Mendorong Upaya Pencegahan
                            Tindak Pidana Korupsi
                          </span>
                          {/* <Badge value="2" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos
                        ducimus qui blanditiis praesentium voluptatum deleniti
                        atque corrupti quos dolores et quas molestias excepturi
                        sint occaecati cupiditate non provident, similique sunt
                        in culpa qui officia deserunt mollitia animi, id est
                        laborum et dolorum fuga. Et harum quidem rerum facilis
                        est et expedita distinctio. Nam libero tempore, cum
                        soluta nobis est eligendi optio cumque nihil impedit quo
                        minus.
                      </p>
                    </AccordionTab>
                  </Accordion>
                </TabPanel>
              </TabView>
            </Dialog>
          </div>
        </Col>
        <Col className="mt-1" md="3" xs="6">
          <Button
            block
            className="btn-white btn-icon mb-3 mb-sm-0 video-button"
            color="default"
            type="button"
            icon="pi pi-external-link"
            onClick={showDialogPH}
          >
            Produk Hukum
          </Button>
          <div className="card">
            <Dialog
              header="Produk Hukum"
              visible={dialogVisiblePH}
              style={{ width: "75vw" }}
              maximizable
              modal
              contentStyle={{ height: "300px" }}
              onHide={hideDialogPH}
              footer={dialogFooterTemplatePH}
            >
              {loadingProdukhukum ? (
                <p>Loading...</p>
              ) : produkhukumError ? (
                <p>Error loading data.</p>
              ) : (
                <DataTable
                  value={produkhukumData} // Menggunakan data dari SWR
                  paginator
                  rows={5}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  tableStyle={{ minWidth: "50rem" }}
                >
                  <Column
                    field="name"
                    header="Name"
                    style={{ width: "35%" }}
                  ></Column>
                  <Column
                    field="description"
                    header="Description"
                    style={{ width: "55%" }}
                  ></Column>
                  <Column
                    field="date"
                    header="Date"
                    style={{ width: "5%" }}
                  ></Column>
                  <Column
                    field="download"
                    header="Download"
                    style={{ width: "5%" }}
                    body={(rowData) => (
                      <Button
                        label="Download"
                        icon="pi pi-download"
                        onClick={() => window.open(rowData.download, "_blank")}
                      />
                    )}
                  ></Column>
                </DataTable>
              )}
            </Dialog>
          </div>
        </Col>
        <Col className="mt-1" md="3" xs="6">
          <Button
            block
            className="btn-white btn-icon mb-3 mb-sm-0 video-button"
            color="default"
            type="button"
            icon="pi pi-external-link"
            onClick={showDialogPH}
          >
            APB Desa
          </Button>
          <div className="card">
            <Dialog
              header="Produk Hukum"
              visible={dialogVisiblePH}
              style={{ width: "75vw" }}
              maximizable
              modal
              contentStyle={{ height: "300px" }}
              onHide={hideDialogPH}
              footer={dialogFooterTemplate}
            >
              <DataTable
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 25, 50]}
                tableStyle={{ minWidth: "50rem" }}
              >
                <Column
                  field="name"
                  header="Name"
                  style={{ width: "35%" }}
                ></Column>
                <Column
                  field="description"
                  header="description"
                  style={{ width: "55%" }}
                ></Column>
                <Column
                  field="date"
                  header="date"
                  style={{ width: "5%" }}
                ></Column>
                <Column
                  field="download"
                  header="download"
                  style={{ width: "5%" }}
                >
                  <Button label="Primary" text raised />
                </Column>
              </DataTable>
            </Dialog>
          </div>
        </Col>
        <Col className="mt-1" md="3" xs="6">
          <Button
            block
            className="btn-white btn-icon mb-3 mb-sm-0 video-button"
            color="default"
            type="button"
            icon="pi pi-external-link"
            onClick={showDialogPH}
          >
            Download (menu informasi)
          </Button>
          <div className="card">
            <Dialog
              header="Produk Hukum"
              visible={dialogVisiblePH}
              style={{ width: "75vw" }}
              maximizable
              modal
              contentStyle={{ height: "300px" }}
              onHide={hideDialogPH}
              footer={dialogFooterTemplate}
            >
              <DataTable
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 25, 50]}
                tableStyle={{ minWidth: "50rem" }}
              >
                <Column
                  field="name"
                  header="Name"
                  style={{ width: "15%" }}
                ></Column>
                <Column
                  field="description"
                  header="description"
                  style={{ width: "65%" }}
                ></Column>
                <Column
                  field="date"
                  header="date"
                  style={{ width: "15%" }}
                ></Column>
                <Column
                  field="download"
                  header="download"
                  style={{ width: "5%" }}
                >
                  <Button label="Primary" text raised />
                </Column>
              </DataTable>
            </Dialog>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Modalt;
