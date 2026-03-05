'use client';

import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from '@react-pdf/renderer';
import { PaymentResult } from '@/types/api/PaymentRes';

Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
});

Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
  fontWeight: 'bold',
});

Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Roboto',
    backgroundColor: '#ffffff',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: '2px solid #1e3a5f',
  },
  logoSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a5f',
    marginBottom: 4,
  },
  companySubtitle: {
    fontSize: 9,
    color: '#666666',
    fontWeight: '300',
  },
  headerInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  docTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a5f',
    marginBottom: 8,
  },
  docNumber: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 3,
  },
 
  section: {
    marginBottom: 25,
    paddingBottom: 15,
    borderBottom: '1px solid #e0e0e0',
  },
  sectionLast: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e3a5f',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: '2px solid #0099cc',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingRight: 10,
  },
  rowLabel: {
    fontWeight: 'bold',
    color: '#333333',
    width: '45%',
  },
  rowValue: {
    color: '#555555',
    width: '55%',
    textAlign: 'right',
  },
 
  featureContainer: {
    marginTop: 10,
    marginBottom: 8,
  },
  featureLabel: {
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 6,
  },
  featureItem: {
    marginLeft: 10,
    marginBottom: 4,
    paddingLeft: 8,
    color: '#555555',
    fontSize: 10,
  },
  
  statusActive: {
    backgroundColor: '#d4f1e4',
    color: '#0d7a40',
    padding: '2px 8px',
    borderRadius: 3,
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusInactive: {
    backgroundColor: '#ffe0e0',
    color: '#a00000',
    padding: '2px 8px',
    borderRadius: 3,
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTop: '1px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  footerText: {
    fontSize: 9,
    color: '#777777',
    textAlign: 'center',
  },
  footerLink: {
    fontSize: 9,
    color: '#0099cc',
    textAlign: 'left',
    textDecoration: 'underline',
  },
  footerCopyright: {
    fontSize: 8,
    color: '#999999',
    textAlign: 'center',
    marginTop: 10,
  },
  
  highlightBox: {
    backgroundColor: '#f0f5f9',
    padding: 12,
    borderRadius: 4,
    borderLeft: '4px solid #0099cc',
    marginTop: 10,
  },
  highlightText: {
    fontSize: 10,
    color: '#1e3a5f',
    fontWeight: 'bold',
  },
});

interface PaymentPDFProps {
  payment: PaymentResult;
}

export const PaymentPDF = ({ payment }: PaymentPDFProps) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.header}>
        <View style={styles.logoSection}>
          <Text style={styles.companyName}>MATAGER</Text>
          <Text style={styles.companySubtitle}></Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.docTitle}>RECEIPT</Text>
          <Text style={styles.docNumber}>Reference: {payment.payment.tranRef}</Text>
          <Text style={styles.docNumber}>
            Date:{' '}
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}> PAYMENT DETAILS</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Transaction Reference:</Text>
          <Text style={styles.rowValue}>{payment.payment.tranRef}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Amount Paid:</Text>
          <Text style={styles.rowValue}>{payment.payment.amount} IQD</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Payment Status:</Text>
          <Text style={styles.rowValue}>{payment.payment.respMessage}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}> SUBSCRIPTION INFORMATION</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Activation Date:</Text>
          <Text style={styles.rowValue}>
            {new Date(payment.userSubscription.startDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Expiration Date:</Text>
          <Text style={styles.rowValue}>
            {new Date(payment.userSubscription.endDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Status:</Text>
          <Text
            style={payment.userSubscription.isActive ? styles.statusActive : styles.statusInactive}
          >
            {payment.userSubscription.isActive ? '  ACTIVE' : ' INACTIVE'}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Product Limit:</Text>
          <Text style={styles.rowValue}>{payment.userSubscription.limitProducts} products</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}> SUBSCRIPTION PLAN</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Plan Type:</Text>
          <Text style={styles.rowValue}>{payment.userSubscription.plan.type}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Plan Price:</Text>
          <Text style={styles.rowValue}>{payment.userSubscription.plan.price} IQD</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Duration:</Text>
          <Text style={styles.rowValue}>{payment.userSubscription.plan.durationDays} days</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Max Stores:</Text>
          <Text style={styles.rowValue}>{payment.userSubscription.plan.maxStores}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Max Suppliers:</Text>
          <Text style={styles.rowValue}>{payment.userSubscription.plan.maxSuppliers}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Max Templates:</Text>
          <Text style={styles.rowValue}>{payment.userSubscription.plan.maxTemplates}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Template Category:</Text>
          <Text style={styles.rowValue}>{payment.userSubscription.plan.templateCategory}</Text>
        </View>

        {payment.userSubscription.plan.features?.length > 0 && (
          <View style={styles.featureContainer}>
            <Text style={styles.featureLabel}>Included Features:</Text>
            {payment.userSubscription.plan.features.map((feature, idx) => (
              <Text key={idx} style={styles.featureItem}>
                {feature}
              </Text>
            ))}
          </View>
        )}
      </View>

      <View style={styles.highlightBox}>
        <Text style={styles.highlightText}>
          This receipt serves as proof of your subscription purchase and renewal.
        </Text>
        <Text style={styles.highlightText}> www.matager.app </Text>
        <Text style={styles.footerLink}>Support: support@matager.com | +964-750-123-4567</Text>
        <Text style={styles.highlightText}>
          © {new Date().getFullYear()} Matager. All rights reserved. This is an official document.
        </Text>
      </View>
    </Page>
  </Document>
);
